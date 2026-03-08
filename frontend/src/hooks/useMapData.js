/**
 * Encapsulates map data fetching and marker building.
 * Single Responsibility: map domain logic. Decouples from Map UI.
 */
import { useState, useEffect, useMemo } from 'react';
import { mapService } from '../services/index.js';

export function useMapData({ supplyId, demandId, isMatchMode, user }) {
  const isDemandMode = !!demandId;
  const isSupplyMode = !!supplyId;

  const [dealPartners, setDealPartners] = useState([]);
  const [networkLoading, setNetworkLoading] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allOrganisations, setAllOrganisations] = useState([]);
  const [orgsLoading, setOrgsLoading] = useState(false);

  useEffect(() => {
    if (!isMatchMode) return;
    const load = async () => {
      setOrgsLoading(true);
      try {
        const data = await mapService.fetchOrganisations();
        setAllOrganisations(data);
      } catch (err) {
        console.error('Failed to fetch organisations:', err);
      } finally {
        setOrgsLoading(false);
      }
    };
    load();
  }, [isMatchMode]);

  useEffect(() => {
    if (isMatchMode || !user) return;
    const load = async () => {
      setNetworkLoading(true);
      try {
        const data = await mapService.fetchDealPartners();
        setDealPartners(data.partners || []);
      } catch (err) {
        console.error('Failed to fetch deal network:', err);
      } finally {
        setNetworkLoading(false);
      }
    };
    load();
  }, [isMatchMode, user]);

  useEffect(() => {
    if (!isMatchMode) return;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mapService.fetchMatchResults(
          isDemandMode ? 'demand' : 'supply',
          isDemandMode ? demandId : supplyId
        );
        setSearchData(data);
      } catch (err) {
        console.error('Failed to fetch match results:', err);
        setError(err.message || 'Failed to load matches');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [supplyId, demandId, isDemandMode, isMatchMode]);

  const originMarker = useMemo(() => {
    if (!searchData) return null;
    return {
      id: 'origin',
      latlng: isDemandMode
        ? [searchData.demand_org_lat, searchData.demand_org_lng]
        : [searchData.supply_org_lat, searchData.supply_org_lng],
      orgName: isDemandMode ? searchData.demand_org_name : searchData.supply_org_name,
      orgMail: '',
      contactName: 'Your Organisation',
      contactNo: '',
      itemName: isDemandMode
        ? (searchData.demand_item_name || `Demand #${searchData.demand_id}`)
        : (searchData.supply_item_name || `Supply #${searchData.supply_id}`),
      itemCategory: isDemandMode ? 'DEMAND ORIGIN' : 'SUPPLY ORIGIN',
      itemPrice: null,
      isOrigin: true,
    };
  }, [searchData, isDemandMode]);

  const matchMarkers = useMemo(() => {
    if (!searchData?.results) return [];
    return searchData.results.map((r, idx) => ({
      id: `match-${r.id || idx}`,
      latlng: [r.org_latitude, r.org_longitude],
      orgName: r.org_name,
      orgMail: r.org_email || '',
      org_id: r.org_id,
      contactName: r.org_phone || '',
      contactNo: r.org_address || '',
      itemName: r.item_name,
      itemCategory: r.item_category || '',
      itemPrice: r.price || null,
      currency: r.currency || '',
      distance_km: r.distance_km,
      match_score: r.match_score,
      name_similarity: r.name_similarity,
      quantity: r.quantity,
      quantity_unit: r.quantity_unit,
      item_description: r.item_description,
      score_breakdown: r.score_breakdown,
      match_labels: r.match_labels,
      category_matched: r.category_matched,
      supply_id: r.supply_id || (isSupplyMode ? null : r.id),
      demand_id: r.demand_id || (isDemandMode ? null : r.id),
      supply_name_snapshot: isSupplyMode
        ? (searchData?.supply_item_name || `Supply #${supplyId}`)
        : r.item_name,
      demand_name_snapshot: isDemandMode
        ? (searchData?.demand_item_name || `Demand #${demandId}`)
        : r.item_name,
      isMatchResult: true,
    }));
  }, [searchData, isDemandMode, isSupplyMode, supplyId, demandId]);

  const myOrgId = searchData
    ? (isDemandMode ? searchData.demand_org_id : searchData.supply_org_id)
    : null;
  const matchedOrgIds = new Set(matchMarkers.map((m) => m.org_id));

  const orgMarkers = useMemo(() => {
    if (!isMatchMode) return [];
    return allOrganisations
      .filter(
        (org) =>
          org.org_id !== myOrgId &&
          !matchedOrgIds.has(org.org_id) &&
          org.latitude &&
          org.longitude
      )
      .map((org) => ({
        id: `org-${org.org_id}`,
        latlng: [parseFloat(org.latitude), parseFloat(org.longitude)],
        orgName: org.org_name,
        orgMail: org.email || '',
        org_id: org.org_id,
        contactName: org.phone_number || '',
        contactNo: org.address || '',
        itemName: org.description ? org.description.substring(0, 50) + '...' : 'Organisation',
        itemCategory: `${org.city}, ${org.state}`,
        itemPrice: null,
        isOrganisation: true,
        city: org.city,
        state: org.state,
        country: org.country,
        website_url: org.website_url,
        description: org.description,
      }));
  }, [isMatchMode, allOrganisations, myOrgId, matchedOrgIds]);

  const myOrgMarker = useMemo(() => {
    if (isMatchMode || !user?.latitude || !user?.longitude) return null;
    return {
      id: 'my-org',
      latlng: [parseFloat(user.latitude), parseFloat(user.longitude)],
      orgName: user.org_name,
      orgMail: user.email || '',
      org_id: user.org_id,
      contactName: user.phone_number || '',
      contactNo: user.address || '',
      itemName: user.description || user.org_name,
      itemCategory: [user.city, user.state].filter(Boolean).join(', '),
      itemPrice: null,
      isMyOrg: true,
    };
  }, [isMatchMode, user]);

  const dealPartnerMarkers = useMemo(() => {
    if (isMatchMode || !dealPartners.length) return [];
    return dealPartners
      .filter((p) => p.latitude && p.longitude)
      .map((p) => ({
        id: `deal-partner-${p.org_id}`,
        latlng: [parseFloat(p.latitude), parseFloat(p.longitude)],
        orgName: p.org_name,
        orgMail: p.email || '',
        org_id: p.org_id,
        contactName: p.phone || '',
        contactNo: p.address || '',
        itemName: p.description ? p.description.substring(0, 60) : p.org_name,
        itemCategory: [p.city, p.state].filter(Boolean).join(', '),
        itemPrice: null,
        isDealPartner: true,
        deals: p.deals || [],
        website_url: p.website_url,
        description: p.description,
      }));
  }, [isMatchMode, dealPartners]);

  const markers = useMemo(() => {
    return isMatchMode
      ? [originMarker, ...matchMarkers, ...orgMarkers].filter(Boolean)
      : [myOrgMarker, ...dealPartnerMarkers].filter(Boolean);
  }, [isMatchMode, originMarker, matchMarkers, orgMarkers, myOrgMarker, dealPartnerMarkers]);

  const defaultCenter = useMemo(() => {
    if (isMatchMode && originMarker) return originMarker.latlng;
    if (myOrgMarker) return myOrgMarker.latlng;
    return [12.835230712705915, 77.69201222327615];
  }, [isMatchMode, originMarker, myOrgMarker]);

  const allPositions = useMemo(() => markers.map((m) => m.latlng), [markers]);

  const polylinePositions = useMemo(() => {
    return isMatchMode && originMarker
      ? matchMarkers.map((m) => [originMarker.latlng, m.latlng])
      : myOrgMarker
      ? dealPartnerMarkers.map((m) => [myOrgMarker.latlng, m.latlng])
      : [];
  }, [isMatchMode, originMarker, matchMarkers, myOrgMarker, dealPartnerMarkers]);

  return {
    isDemandMode,
    isSupplyMode,
    searchData,
    allOrganisations,
    dealPartners,
    markers,
    originMarker,
    matchMarkers,
    orgMarkers,
    myOrgMarker,
    dealPartnerMarkers,
    defaultCenter,
    allPositions,
    polylinePositions,
    isLoading,
    error,
    networkLoading,
  };
}
