export const demoUser = { id: 'demo-1', email: 'rider@gearlog.app', full_name: 'Arjun Mehta' }

export const demoVehicles = [
  {
    id: 'v1', user_id: 'demo-1', nickname: 'Interceptor', type: 'bike',
    make: 'Royal Enfield', model: 'Interceptor 650', year: 2023,
    fuel_type: 'petrol', condition: 'new', current_odometer: 12450,
    last_oil_change_date: '2024-09-15', last_oil_change_km: 11500,
    oil_brand: 'Motul', oil_grade: '10W-40',
    last_service_date: '2024-08-20', last_service_km: 10500,
    last_service_type: 'general', workshop_name: 'RE Service Center',
    air_filter_km: 10000, chain_km: 11000, brake_pads_km: 8000, tyres_km: 5000,
    insurance_expiry: '2025-01-15', puc_expiry: '2025-03-10', battery_date: '2023-01-15',
  },
  {
    id: 'v2', user_id: 'demo-1', nickname: 'Swift', type: 'car',
    make: 'Maruti', model: 'Swift ZXi', year: 2022,
    fuel_type: 'petrol', condition: 'used', current_odometer: 34200,
    last_oil_change_date: '2024-10-01', last_oil_change_km: 32000,
    last_service_date: '2024-10-01', last_service_km: 32000,
    last_service_type: 'major', workshop_name: 'Maruti Arena',
    air_filter_km: 28000, brake_pads_km: 20000, tyres_km: 15000,
    insurance_expiry: '2025-06-20', puc_expiry: '2025-04-18', battery_date: '2022-06-01',
  },
]

export const demoFuelLogs = [
  { id:'f1', vehicle_id:'v1', date:'2024-12-18', odometer:12450, litres:12, total_cost:1320, full_tank:true, station_name:'HP Petrol Pump' },
  { id:'f2', vehicle_id:'v1', date:'2024-12-10', odometer:12100, litres:11.5, total_cost:1265, full_tank:true, station_name:'Indian Oil' },
  { id:'f3', vehicle_id:'v1', date:'2024-12-02', odometer:11760, litres:12.5, total_cost:1375, full_tank:true, station_name:'BPCL' },
  { id:'f4', vehicle_id:'v1', date:'2024-11-24', odometer:11400, litres:11, total_cost:1210, full_tank:true, station_name:'HP Petrol Pump' },
  { id:'f5', vehicle_id:'v1', date:'2024-11-16', odometer:11080, litres:10.5, total_cost:1155, full_tank:true, station_name:'Shell' },
  { id:'f6', vehicle_id:'v1', date:'2024-11-08', odometer:10770, litres:11, total_cost:1210, full_tank:true, station_name:'Indian Oil' },
  { id:'f7', vehicle_id:'v2', date:'2024-12-15', odometer:34200, litres:32, total_cost:3520, full_tank:true, station_name:'HP Petrol Pump' },
  { id:'f8', vehicle_id:'v2', date:'2024-12-05', odometer:33700, litres:30, total_cost:3300, full_tank:true, station_name:'Indian Oil' },
  { id:'f9', vehicle_id:'v2', date:'2024-11-25', odometer:33150, litres:33, total_cost:3630, full_tank:true, station_name:'BPCL' },
]

export const demoServiceLogs = [
  { id:'s1', vehicle_id:'v1', date:'2024-09-15', odometer:11500, service_type:'oil_change', parts_changed:['Engine Oil','Oil Filter'], oil_brand:'Motul', oil_grade:'10W-40', total_cost:1800, workshop_name:'RE Service Center' },
  { id:'s2', vehicle_id:'v1', date:'2024-08-20', odometer:10500, service_type:'general', parts_changed:['Air Filter','Spark Plug'], total_cost:3200, workshop_name:'RE Service Center' },
  { id:'s3', vehicle_id:'v2', date:'2024-10-01', odometer:32000, service_type:'major', parts_changed:['Engine Oil','Oil Filter','Air Filter','Cabin Filter','Brake Fluid'], oil_brand:'Castrol', oil_grade:'5W-30', total_cost:8500, workshop_name:'Maruti Arena' },
]

export const demoTrips = [
  { id:'t1', vehicle_id:'v1', date:'2024-12-17', from_location:'Home', to_location:'Office', start_km:12420, end_km:12450, distance:30, purpose:'work' },
  { id:'t2', vehicle_id:'v2', date:'2024-12-14', from_location:'Mumbai', to_location:'Lonavala', start_km:34050, end_km:34200, distance:150, purpose:'travel' },
]
