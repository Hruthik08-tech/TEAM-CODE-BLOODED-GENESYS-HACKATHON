import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Popup, Polyline, Circle, useMapEvents, useMap } from 'react-leaflet';

import CustomMarker from '../components/CustomMarker.jsx';
import MapControls from '../components/MapControls.jsx';
import MapPopup from '../components/MapPopup.jsx';
import MatchResultsPanel from '../components/MapComponents/MatchResultsPanel/MatchResultsPanel.jsx';
import {
  MapLoadingOverlay,
  MapErrorBanner,
  MatchInfoBadge,
  DealNetworkBadge,
  SendRequestModal,
} from '../components/Map/index.js';
import MarkerPopupContent from '../components/Map/Popups/MarkerPopupContent.jsx';
import { mapStyles } from '../utils/mapStyles.js';
import { MARKER_ICONS } from '../utils/markerIcons.js';
import { useMapData } from '../hooks/useMapData.js';
import { useAuth } from '../context/AuthContext.jsx';
import { requestService } from '../services/index.js';

function ZoomHandler({ setZoomLevel }) {
  const map = useMapEvents({
    zoomend: () => setZoomLevel(map.getZoom()),
  });
  return null;
}

function FitBounds({ positions }) {
  const map = useMap();
  const hasAutoFitted = React.useRef(false);

  React.useEffect(() => {
    if (!positions?.length) {
      hasAutoFitted.current = false;
      return;
    }
    if (!hasAutoFitted.current) {
      if (positions.length > 1) {
        map.fitBounds(positions, { padding: [50, 50], maxZoom: 14 });
      } else {
        map.setView(positions[0], 13);
      }
      hasAutoFitted.current = true;
    }
  }, [positions, map]);
  return null;
}

const Map = () => {
  const { supplyId, demandId } = useParams();
  const isMatchMode = !!supplyId || !!demandId;
  const { user } = useAuth();

  const [currentStyle, setCurrentStyle] = useState('osm');
  const [zoomLevel, setZoomLevel] = useState(17);
  const [showResultsPanel, setShowResultsPanel] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [requestForm, setRequestForm] = useState({ message: '' });
  const [requestSending, setRequestSending] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState(null);

  const mapData = useMapData({
    supplyId,
    demandId,
    isMatchMode,
    user,
  });

  const {
    isDemandMode,
    isSupplyMode,
    searchData,
    allOrganisations,
    markers,
    originMarker,
    matchMarkers,
    dealPartnerMarkers,
    defaultCenter,
    allPositions,
    polylinePositions,
    isLoading,
    error,
    networkLoading,
  } = mapData;

  const openRequestModal = useCallback((marker) => {
    setSelectedMarker(marker);
    setRequestForm({ message: '' });
    setRequestSuccess(false);
    setRequestError(null);
    setShowRequestModal(true);
  }, []);

  const closeRequestModal = useCallback(() => {
    setShowRequestModal(false);
    setSelectedMarker(null);
    setRequestSuccess(false);
    setRequestError(null);
  }, []);

  const handleSendRequest = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedMarker) return;

      setRequestSending(true);
      setRequestError(null);
      try {
        const payload = {
          requested_to: selectedMarker.org_id,
          supply_id: isSupplyMode ? parseInt(supplyId) : selectedMarker.supply_id || null,
          demand_id: isDemandMode ? parseInt(demandId) : selectedMarker.demand_id || null,
          match_score: selectedMarker.match_score ?? null,
          supply_name_snapshot:
            selectedMarker.supply_name_snapshot ||
            (isSupplyMode ? searchData?.supply_item_name || `Supply #${supplyId}` : selectedMarker.itemName) ||
            null,
          demand_name_snapshot:
            selectedMarker.demand_name_snapshot ||
            (isDemandMode ? searchData?.demand_item_name || `Demand #${demandId}` : selectedMarker.itemName) ||
            null,
          message: requestForm.message || null,
        };
        await requestService.createRequest(payload);
        setRequestSuccess(true);
      } catch (err) {
        console.error('Failed to send request:', err);
        setRequestError(err.message || 'Failed to send request');
      } finally {
        setRequestSending(false);
      }
    },
    [selectedMarker, isSupplyMode, isDemandMode, supplyId, demandId, searchData, requestForm]
  );

  const getMarkerIcon = (marker) => {
    if (marker.isMyOrg) return MARKER_ICONS.myOrg;
    if (marker.isDealPartner) return MARKER_ICONS.dealPartner;
    if (marker.isOrigin) return MARKER_ICONS.matchOrigin;
    if (marker.isMatchResult) return MARKER_ICONS.matchResult;
    if (marker.isOrganisation) return MARKER_ICONS.organisation;
    return undefined;
  };

  const handleSelectMatch = () => {};

  return (
    <div className="map-wrapper">
      {isMatchMode && searchData && !isLoading && (
        <MatchResultsPanel
          results={searchData.results}
          isVisible={showResultsPanel}
          onToggle={() => setShowResultsPanel(!showResultsPanel)}
          isDemandMode={isDemandMode}
          searchData={searchData}
          onSelectMatch={handleSelectMatch}
        />
      )}

      {isLoading && (
        <MapLoadingOverlay
          message={isDemandMode ? 'Searching for matching supplies...' : 'Searching for matching demands...'}
        />
      )}

      {error && <MapErrorBanner message={error} />}

      {isMatchMode && searchData && !isLoading && (
        <MatchInfoBadge
          totalResults={searchData.total_results}
          searchRadiusKm={searchData.search_radius_km}
          orgCount={allOrganisations.length}
          cached={searchData.cached}
          cacheExpiresMinutes={searchData.cached ? Math.floor(searchData.cache_expires_in_seconds / 60) : 0}
        />
      )}

      {!isMatchMode && mapData.myOrgMarker && dealPartnerMarkers.length > 0 && !networkLoading && (
        <DealNetworkBadge partnerCount={dealPartnerMarkers.length} />
      )}

      {!isMatchMode && networkLoading && (
        <MapLoadingOverlay message="Loading your deal network..." accentColor="#F59E0B" />
      )}

      <MapContainer
        center={defaultCenter}
        zoom={isMatchMode ? 10 : dealPartnerMarkers.length > 0 ? 10 : 13}
        scrollWheelZoom
        zoomControl={false}
        doubleClickZoom
        dragging
        animate
      >
        <MapControls currentStyle={currentStyle} setCurrentStyle={setCurrentStyle} allPositions={allPositions} />
        <ZoomHandler setZoomLevel={setZoomLevel} />
        {allPositions.length > 1 && <FitBounds positions={allPositions} />}
        <TileLayer attribution={mapStyles[currentStyle].attribution} url={mapStyles[currentStyle].url} />

        {isMatchMode && originMarker && searchData && (
          <Circle
            center={originMarker.latlng}
            radius={searchData.search_radius_km * 1000}
            pathOptions={{
              color: '#2364AA',
              weight: 1.5,
              fillColor: '#2364AA',
              fillOpacity: 0.04,
              dashArray: '8, 6',
            }}
          />
        )}

        {zoomLevel > (isMatchMode ? 4 : 3) &&
          markers.map((marker) => (
            <CustomMarker key={marker.id} position={marker.latlng} icon={getMarkerIcon(marker)}>
              <Popup maxWidth={320}>
                <MarkerPopupContent
                  marker={marker}
                  isMatchMode={isMatchMode}
                  isDemandMode={isDemandMode}
                  onSendRequest={openRequestModal}
                  fallbackComponent={MapPopup}
                />
              </Popup>
            </CustomMarker>
          ))}

        {zoomLevel > (isMatchMode ? 4 : 12) &&
          polylinePositions.map((positions, idx) => (
            <Polyline
              key={`polyline-${idx}`}
              positions={positions}
              pathOptions={{
                color: isMatchMode ? '#2364AA' : '#3498db',
                weight: isMatchMode ? 2.5 : 2,
                opacity: 0.6,
                dashArray: isMatchMode ? '10, 8' : null,
                className: 'floating-line',
              }}
            />
          ))}
      </MapContainer>

      {showRequestModal && selectedMarker && (
        <SendRequestModal
          selectedMarker={selectedMarker}
          requestForm={requestForm}
          onFormChange={setRequestForm}
          onSubmit={handleSendRequest}
          onClose={closeRequestModal}
          isSending={requestSending}
          isSuccess={requestSuccess}
          error={requestError}
          isSupplyMode={isSupplyMode}
          isDemandMode={isDemandMode}
          supplyId={supplyId}
          demandId={demandId}
          searchData={searchData}
        />
      )}
    </div>
  );
};

export default Map;