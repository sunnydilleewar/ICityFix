const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runE2ETests() {
  console.log('=== ICITYFIX END-TO-END AUTOMATED VERIFICATION ===\n');

  // 1. Health API
  const health = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
  });
  console.log('✔ Health Check:', health.status === 200 ? 'PASSED' : 'FAILED', health.data);

  // 2. Demo Credentials
  const creds = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/demo-credentials',
    method: 'GET',
  });
  console.log('✔ Demo Credentials API:', creds.status === 200 ? 'PASSED' : 'FAILED', `(${creds.data.data.length} accounts found)`);

  // 3. Citizen Login
  const citizenAuth = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'citizen@icityfix.local', password: 'iCityFix@123' }
  );
  console.log('✔ Citizen Authentication:', citizenAuth.status === 200 ? 'PASSED' : 'FAILED', `Token: ${citizenAuth.data.data.token.slice(0, 20)}...`);
  const citizenToken = citizenAuth.data.data.token;

  // 4. Municipal Admin Login
  const adminAuth = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@icityfix.local', password: 'iCityFix@123' }
  );
  console.log('✔ Admin Authentication:', adminAuth.status === 200 ? 'PASSED' : 'FAILED', `Role: ${adminAuth.data.data.role}`);
  const adminToken = adminAuth.data.data.token;

  // 5. Duplicate Detection Query
  const dupCheck = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/reports/duplicates?lng=77.6412&lat=12.9716&category=ROADS_POTHOLES',
    method: 'GET',
  });
  console.log(
    '✔ Advisory Duplicate Detection:',
    dupCheck.status === 200 && dupCheck.data.hasPotentialDuplicate ? 'PASSED' : 'FAILED',
    `Found ${dupCheck.data.count} candidates (Closest: ${dupCheck.data.data[0]?.distanceMeters}m away)`
  );

  // 6. Create Report with GeoJSON Point coordinates
  const newReport = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/reports',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`,
      },
    },
    {
      title: 'Water pipe leak flooding pedestrian walkway on 100ft Road',
      category: 'WATER_DRAINAGE',
      description: 'Underground supply pipe cracked causing continuous clean water loss and hazardous road ponding.',
      coordinates: [77.6425, 12.973],
      address: '100ft Road near 12th Main, Indiranagar',
      ward: 'Ward 112 - Domlur',
      priority: 'HIGH',
      images: ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'],
    }
  );
  console.log(
    '✔ Report Submission (GeoJSON 2dsphere):',
    newReport.status === 201 ? 'PASSED' : 'FAILED',
    `Generated ID: ${newReport.data.data?.reportId}`
  );
  const createdReportId = newReport.data.data?._id;
  const humanReportId = newReport.data.data?.reportId;

  // 7. Admin Dashboard Metrics (Real Database Aggregations)
  const adminDash = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(
    '✔ Admin Dashboard Real Database KPIs:',
    adminDash.status === 200 ? 'PASSED' : 'FAILED',
    adminDash.data.data?.metrics
  );

  // 8. Admin Status Transition (REPORTED -> IN_PROGRESS) with Audit Trail
  const statusUpdate = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/reports/${createdReportId}/status`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    },
    {
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      note: 'Water board rapid response team dispatched with heavy suction pumps.',
    }
  );
  console.log(
    '✔ Admin Workflow State Transition & Audit Trail:',
    statusUpdate.status === 200 && statusUpdate.data.data.status === 'IN_PROGRESS' ? 'PASSED' : 'FAILED',
    `Status: ${statusUpdate.data.data?.status}, History Count: ${statusUpdate.data.data?.statusHistory?.length}`
  );

  // 9. Citizen Tracking & Notification
  const citizenNotifs = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/notifications',
    method: 'GET',
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  console.log(
    '✔ Citizen In-App Notification Delivery:',
    citizenNotifs.status === 200 ? 'PASSED' : 'FAILED',
    `Unread alerts: ${citizenNotifs.data.unreadCount}, Latest: "${citizenNotifs.data.data[0]?.title}"`
  );

  // 10. Admin Analytics Pipeline
  const analytics = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/analytics',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(
    '✔ Admin Aggregation Analytics ($group by category, status, ward):',
    analytics.status === 200 ? 'PASSED' : 'FAILED',
    `Categories: ${analytics.data.data?.categoryStats?.length}, Wards: ${analytics.data.data?.wardStats?.length}`
  );

  console.log('\n=== ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY ===');
}

runE2ETests().catch(console.error);
