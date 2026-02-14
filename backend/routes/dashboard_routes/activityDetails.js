const express = require('express');
const router = express.Router();
const pool = require('../../connections/db');

// Get all dashboard stats summary
router.get('/', async (req, res) => {
    try {
        const orgId = req.user.org_id;
        
        const [supplies] = await pool.query(
            "SELECT COUNT(*) AS count FROM org_supply WHERE org_id = ? AND is_active = TRUE AND deleted_at IS NULL",
            [orgId]
        );
        
        const [demands] = await pool.query(
            "SELECT COUNT(*) AS count FROM org_demand WHERE org_id = ? AND is_active = TRUE AND deleted_at IS NULL",
            [orgId]
        );
        
        const [pending] = await pool.query(
            "SELECT COUNT(*) AS count FROM requests WHERE (requested_by = ? OR requested_to = ?) AND status = 'pending' AND deleted_at IS NULL",
            [orgId, orgId]
        );
        
        const [deals] = await pool.query(
            "SELECT COUNT(*) AS count FROM deal WHERE (supply_org_id = ? OR demand_org_id = ?) AND deal_status = 'active'",
            [orgId, orgId]
        );

        res.status(200).json({
            activeSupplies: supplies[0].count,
            activeDemands: demands[0].count,
            pendingRequests: pending[0].count,
            activeDeals: deals[0].count
        });
    } catch (error) {
        console.error('Error fetching activity summary:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Individual routes (maintained for compatibility if needed, but updated)
router.get('/active-supplies', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT COUNT(*) AS count FROM org_supply WHERE org_id = ? AND is_active = TRUE AND deleted_at IS NULL",
            [req.user.org_id]
        );
        res.status(200).json({ active_supplies: rows[0].count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/active-demands', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT COUNT(*) AS count FROM org_demand WHERE org_id = ? AND is_active = TRUE AND deleted_at IS NULL",
            [req.user.org_id]
        );
        res.status(200).json({ active_demands: rows[0].count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/pending-requests', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT COUNT(*) AS count FROM requests WHERE (requested_by = ? OR requested_to = ?) AND status = 'pending' AND deleted_at IS NULL",
            [req.user.org_id, req.user.org_id]
        );
        res.status(200).json({ pending_requests: rows[0].count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/active-deals', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT COUNT(*) AS count FROM deal WHERE (supply_org_id = ? OR demand_org_id = ?) AND deal_status = 'active'",
            [req.user.org_id, req.user.org_id]
        );
        res.status(200).json({ active_deals: rows[0].count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get recent activity based on notifications
router.get('/recent-activity', async (req, res) => {
    try {
        const orgId = req.user.org_id;
        let requests = [], messages = [], deals = [];
        
        // 1. Requests activity
        try {
            const [rows] = await pool.query(`
                SELECT 
                    n.notification_id as id,
                    n.type,
                    n.title,
                    n.message,
                    n.created_at,
                    r.supply_name_snapshot,
                    r.demand_name_snapshot
                FROM notification n
                JOIN requests r ON r.request_id = n.reference_id
                WHERE n.org_id = ?
                  AND n.type IN ('request_received', 'request_accepted', 'request_rejected')
                  AND n.reference_type = 'request'
                ORDER BY n.created_at DESC
                LIMIT 20
            `, [orgId]);
            requests = rows;
        } catch (e) {
            console.error('Requests query failed:', e.message);
        }

        // 2. Message activity
        try {
            // Note: Join with DISTINCT on notification to avoid duplicates from multiple messages
            const [rows] = await pool.query(`
                SELECT DISTINCT
                    n.notification_id as id,
                    n.type,
                    n.title,
                    n.created_at,
                    br.supply_name_snapshot,
                    br.demand_name_snapshot,
                    o.org_name AS sender_org_name
                FROM notification n
                JOIN business_room br ON br.room_id = n.reference_id
                JOIN room_message rm ON rm.room_id = br.room_id
                JOIN organisation o ON o.org_id = rm.sender_org_id
                WHERE n.org_id = ?
                  AND n.type = 'new_message'
                  AND n.reference_type = 'business_room'
                  AND rm.sender_org_id != ?
                ORDER BY n.created_at DESC
                LIMIT 20
            `, [orgId, orgId]);
            messages = rows;
        } catch (e) {
            console.error('Messages query failed:', e.message);
        }

        // 3. Deal activity
        try {
            const [rows] = await pool.query(`
                SELECT 
                    n.notification_id as id,
                    n.type,
                    n.title,
                    n.created_at,
                    d.supply_name_snapshot,
                    d.deal_id
                FROM notification n
                JOIN deal d ON d.deal_id = n.reference_id
                WHERE n.org_id = ?
                  AND n.type = 'deal_success'
                  AND n.reference_type = 'deal'
                ORDER BY n.created_at DESC
                LIMIT 20
            `, [orgId]);
            deals = rows;
        } catch (e) {
            console.error('Deals query failed:', e.message);
        }

        // Merge and format
        const combined = [
            ...requests.map(r => ({
                id: r.id,
                type: 'request',
                title: r.title,
                desc: r.message || `For ${r.supply_name_snapshot || r.demand_name_snapshot}`,
                time: r.created_at,
            })),
            ...messages.map(m => ({
                id: m.id,
                type: 'room',
                title: m.title,
                desc: `Message from ${m.sender_org_name} regarding ${m.supply_name_snapshot || m.demand_name_snapshot}`,
                time: m.created_at,
            })),
            ...deals.map(d => ({
                id: d.id,
                type: 'deal',
                title: d.title,
                desc: `Deal finalized for ${d.supply_name_snapshot}`,
                time: d.created_at,
            }))
        ];

        // Sort combined list by time descending
        combined.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.status(200).json(combined.slice(0, 20));
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            details: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;

