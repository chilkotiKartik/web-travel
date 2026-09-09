// The full Wayfare departure list, grouped the way the operations team lists it.
//
// Facts recorded here are geographic and route facts only — coordinates, pass and
// summit elevations, grade and the season a route is normally walked. Prices and
// fixed departure dates are deliberately absent: they are commercial decisions, so
// every journey shows "Dates & price on request" and routes the traveller into the
// planner rather than displaying a number nobody has set.

export const regions = [
  {
    id: 'uttarakhand',
    name: 'Uttarakhand Treks',
    country: 'India',
    lat: 30.3,
    lng: 79.3,
    blurb: 'The Garhwal and Kumaon Himalaya — high meadows, ridge walks and glacier snouts.',
    accent: '#1361e0',
  },
  {
    id: 'yatras',
    name: 'Spiritual Yatras',
    country: 'India',
    lat: 30.7,
    lng: 79.5,
    blurb: 'Pilgrimage routes through the Himalaya, run at pilgrim pace with proper acclimatisation.',
    accent: '#c2410c',
  },
  {
    id: 'himachal',
    name: 'Himachal Treks',
    country: 'India',
    lat: 32.1,
    lng: 77.2,
    blurb: 'Kullu, Parvati, Kangra and Kinnaur — passes, alpine lakes and forest walks.',
    accent: '#0f766e',
  },
  {
    id: 'spiti',
    name: 'Spiti Valley',
    country: 'India',
    lat: 32.25,
    lng: 78.02,
    blurb: 'A cold desert at 12,000ft — monasteries, moonscapes and frozen winter roads.',
    accent: '#7e22ce',
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    country: 'India',
    lat: 34.15,
    lng: 77.57,
    blurb: 'Leh, Nubra and Pangong, across the highest motorable passes in the country.',
    accent: '#0369a1',
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    country: 'India',
    lat: 25.7,
    lng: 82.0,
    blurb: 'The Ganga plains — ghats, temple towns and festival nights.',
    accent: '#b45309',
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    country: 'India',
    lat: 26.5,
    lng: 74.5,
    blurb: 'Fort cities, lake palaces, desert dunes and a tiger reserve.',
    accent: '#be123c',
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    country: 'India',
    lat: 19.0,
    lng: 73.6,
    blurb: 'Sahyadri forts, waterfalls and monsoon ridges — weekend country from Mumbai and Pune.',
    accent: '#15803d',
  },
  {
    id: 'nepal',
    name: 'Nepal',
    country: 'Nepal',
    lat: 28.0,
    lng: 84.5,
    blurb: 'Kathmandu valley, the Annapurna sanctuary, Chitwan and the road to Kailash.',
    accent: '#0891b2',
  },
  {
    id: 'international',
    name: 'International',
    country: 'Asia',
    lat: 10.0,
    lng: 95.0,
    blurb: 'Short-haul escapes beyond India.',
    accent: '#a16207',
  },
]

/** kind values drive the filter chips and marker styling on the globe. */
export const journeyKinds = ['Trek', 'Backpacking', 'Yatra', 'Bike Trip', 'Wildlife', 'City & Culture']

export const journeys = [
  // ---------- Uttarakhand treks ----------
  { id: 'roopkund', name: 'Roopkund Trek', region: 'uttarakhand', kind: 'Trek', lat: 30.26, lng: 79.73, grade: 'Difficult', altitude: '16,499 ft', season: 'May – Jun, Sep – Oct', note: 'The glacial lake below Junargali, reached across the Ali and Bedni meadows.' },
  { id: 'chopta-tungnath', name: 'Chopta Tungnath', region: 'uttarakhand', kind: 'Trek', lat: 30.49, lng: 79.22, grade: 'Easy', altitude: '13,123 ft', season: 'Year round', note: 'The highest Shiva temple in the world, with Chandrashila summit above it.' },
  { id: 'panch-kedar-trek', name: 'Panch Kedar', region: 'uttarakhand', kind: 'Trek', lat: 30.63, lng: 79.2, grade: 'Difficult', season: 'May – Jun, Sep – Oct', note: 'The five Kedar shrines linked on foot across Garhwal.' },
  { id: 'nag-tibba', name: 'Nag Tibba', region: 'uttarakhand', kind: 'Trek', lat: 30.55, lng: 78.15, grade: 'Easy', altitude: '9,915 ft', season: 'Year round', note: 'The classic weekend summit out of Dehradun — snow in winter, green the rest of the year.' },
  { id: 'kartik-swami', name: 'Kartik Swami', region: 'uttarakhand', kind: 'Trek', lat: 30.3, lng: 79.09, grade: 'Easy', altitude: '10,300 ft', season: 'Year round', note: 'A ridge temple with a near-360° view of the Garhwal peaks.' },
  { id: 'munsiyari', name: 'Munsiyari', region: 'uttarakhand', kind: 'Trek', lat: 30.07, lng: 80.24, grade: 'Easy', season: 'Mar – Jun, Sep – Nov', note: 'Kumaon hill base facing the Panchachuli massif.' },
  { id: 'kedarkantha', name: 'Kedarkantha', region: 'uttarakhand', kind: 'Trek', lat: 31.03, lng: 78.2, grade: 'Moderate', altitude: '12,500 ft', season: 'Dec – Apr', note: 'India’s best-known winter summit trek, through Govind National Park pine forest.' },
  { id: 'kuari-pass', name: 'Kuari Pass', region: 'uttarakhand', kind: 'Trek', lat: 30.52, lng: 79.6, grade: 'Moderate', altitude: '12,516 ft', season: 'Dec – Apr, Sep – Nov', note: 'Curzon’s trail, looking straight at Nanda Devi and Dronagiri.' },
  { id: 'brahmatal', name: 'Brahmatal', region: 'uttarakhand', kind: 'Trek', lat: 30.22, lng: 79.55, grade: 'Moderate', altitude: '12,250 ft', season: 'Dec – Mar', note: 'A frozen lake ridge with Trishul and Nanda Ghunti in front of you.' },
  { id: 'dayara-bugyal', name: 'Dayara Bugyal', region: 'uttarakhand', kind: 'Trek', lat: 30.9, lng: 78.55, grade: 'Easy', altitude: '11,800 ft', season: 'Dec – Apr, Sep – Nov', note: 'One of the widest high meadows in the country.' },
  { id: 'har-ki-dun', name: 'Har Ki Dun', region: 'uttarakhand', kind: 'Trek', lat: 31.1, lng: 78.44, grade: 'Moderate', altitude: '11,700 ft', season: 'Mar – Jun, Sep – Nov', note: 'The cradle valley below Swargarohini, through centuries-old Ramassery villages.' },
  { id: 'bali-pass', name: 'Bali Pass', region: 'uttarakhand', kind: 'Trek', lat: 31.05, lng: 78.45, grade: 'Difficult', altitude: '16,207 ft', season: 'May – Jun, Sep – Oct', note: 'A high crossing from Har Ki Dun over to Yamunotri.' },
  { id: 'gomukh', name: 'Gomukh', region: 'uttarakhand', kind: 'Trek', lat: 30.93, lng: 79.08, grade: 'Moderate', altitude: '13,200 ft', season: 'May – Jun, Sep – Oct', note: 'The snout of the Gangotri glacier, where the Bhagirathi emerges.' },
  { id: 'rupin-pass', name: 'Rupin Pass', region: 'uttarakhand', kind: 'Trek', lat: 31.3, lng: 78.2, grade: 'Difficult', altitude: '15,250 ft', season: 'May – Jun, Sep – Oct', note: 'A crossing that changes landscape every day and finishes in Himachal.' },
  { id: 'valley-of-flowers', name: 'Valley of Flowers', region: 'uttarakhand', kind: 'Trek', lat: 30.73, lng: 79.6, grade: 'Moderate', altitude: '14,100 ft', season: 'Jul – Sep', note: 'A UNESCO World Heritage valley, usually paired with Hemkund Sahib.' },
  { id: 'phulara-ridge', name: 'Phulara Ridge', region: 'uttarakhand', kind: 'Trek', lat: 31.05, lng: 78.2, grade: 'Moderate', altitude: '12,100 ft', season: 'Mar – Jun, Sep – Nov', note: 'A rare trek that walks along the ridge itself rather than beside it.' },
  { id: 'ali-bedni', name: 'Ali Bedni Bugyal', region: 'uttarakhand', kind: 'Trek', lat: 30.15, lng: 79.62, grade: 'Moderate', altitude: '11,500 ft', season: 'Dec – Apr, Sep – Nov', note: 'Twin meadows on the Roopkund trail, walked on their own as a shorter trek.' },
  { id: 'gulabi-kantha', name: 'Gulabi Kantha', region: 'uttarakhand', kind: 'Trek', lat: 30.98, lng: 78.19, grade: 'Moderate', season: 'Dec – Apr', note: 'A quieter winter summit in the Kedarkantha region.' },
  { id: 'darma-valley', name: 'Darma Valley', region: 'uttarakhand', kind: 'Trek', lat: 30.3, lng: 80.55, grade: 'Moderate', season: 'May – Jun, Sep – Oct', note: 'A remote Kumaon border valley of high villages below Panchachuli.' },
  { id: 'auli-chopta-rishikesh', name: 'Auli · Chopta · Rishikesh', region: 'uttarakhand', kind: 'Backpacking', lat: 30.53, lng: 79.57, season: 'Year round', note: 'Three Garhwal bases in one loop — ski slope, meadow and river town.' },
  { id: 'uttarakhand-bike-trip', name: 'Uttarakhand Bike Trip', region: 'uttarakhand', kind: 'Bike Trip', lat: 30.09, lng: 78.27, season: 'Mar – Jun, Sep – Nov', note: 'Eight days riding the Garhwal hill roads out of Rishikesh.' },
  { id: 'kumaon-backpack', name: 'Nainital · Almora · Jageshwar · Mukteshwar', region: 'uttarakhand', kind: 'Backpacking', lat: 29.39, lng: 79.45, season: 'Year round', note: 'The Kumaon hill circuit — lakes, a deodar temple complex and orchard country.' },
  { id: 'kanatal-backpack', name: 'Kanatal · Chakrata · Mussoorie', region: 'uttarakhand', kind: 'Backpacking', lat: 30.46, lng: 78.07, season: 'Year round', note: 'Quiet hill stations either side of Mussoorie.' },

  // ---------- Spiritual yatras ----------
  { id: 'char-dham', name: 'Char Dham Yatra', region: 'yatras', kind: 'Yatra', lat: 30.73, lng: 79.07, season: 'May – Jun, Sep – Oct', note: 'Yamunotri, Gangotri, Kedarnath and Badrinath in one circuit.' },
  { id: 'kedarnath', name: 'Kedarnath', region: 'yatras', kind: 'Yatra', lat: 30.735, lng: 79.067, altitude: '11,755 ft', season: 'May – Jun, Sep – Oct', note: 'The 16km walk up from Gaurikund to the shrine.' },
  { id: 'panch-kedar-yatra', name: 'Panch Kedar Yatra', region: 'yatras', kind: 'Yatra', lat: 30.63, lng: 79.2, season: 'May – Jun, Sep – Oct', note: 'Kedarnath, Tungnath, Rudranath, Madhyamaheshwar and Kalpeshwar.' },
  { id: 'adi-kailash', name: 'Adi Kailash & Om Parvat', region: 'yatras', kind: 'Yatra', lat: 30.34, lng: 80.98, altitude: '18,399 ft', season: 'May – Oct', note: 'The Kumaon route to Adi Kailash and the Om-marked face of Om Parvat.' },
  { id: 'do-dham', name: 'Do Dham Yatra', region: 'yatras', kind: 'Yatra', lat: 30.99, lng: 78.44, season: 'May – Jun, Sep – Oct', note: 'Yamunotri and Gangotri, the two western dhams.' },

  // ---------- Himachal ----------
  { id: 'hampta-pass', name: 'Hampta Pass', region: 'himachal', kind: 'Trek', lat: 32.24, lng: 77.3, grade: 'Moderate', altitude: '14,100 ft', season: 'Jun – Sep', note: 'Green Kullu on one side, the Lahaul desert on the other, in a single day.' },
  { id: 'sar-pass', name: 'Sar Pass', region: 'himachal', kind: 'Trek', lat: 32.02, lng: 77.35, grade: 'Moderate', altitude: '13,800 ft', season: 'May – Jun, Sep – Oct', note: 'A Parvati valley crossing that finishes with a long snow slide.' },
  { id: 'triund', name: 'Triund Trek', region: 'himachal', kind: 'Trek', lat: 32.25, lng: 76.34, grade: 'Easy', altitude: '9,350 ft', season: 'Year round', note: 'The overnight ridge above McLeodganj, under the Dhauladhar wall.' },
  { id: 'buran-ghati', name: 'Buran Ghati', region: 'himachal', kind: 'Trek', lat: 31.35, lng: 78.05, grade: 'Difficult', altitude: '15,000 ft', season: 'May – Jun, Sep – Oct', note: 'A Kinnaur pass with a roped snow descent on the far side.' },
  { id: 'pin-bhaba-pass', name: 'Pin Bhaba Pass', region: 'himachal', kind: 'Trek', lat: 31.75, lng: 78.1, grade: 'Difficult', altitude: '16,105 ft', season: 'Jul – Sep', note: 'Green Kinnaur to the Spiti cold desert across one high pass.' },
  { id: 'bhrigu-lake', name: 'Bhrigu Lake', region: 'himachal', kind: 'Trek', lat: 32.31, lng: 77.24, grade: 'Moderate', altitude: '14,100 ft', season: 'May – Oct', note: 'A high glacial lake reached from meadows above Gulaba.' },
  { id: 'yulla-kanda', name: 'Yulla Kanda', region: 'himachal', kind: 'Trek', lat: 31.6, lng: 78.35, grade: 'Moderate', season: 'May – Oct', note: 'A little-walked Kinnaur trail to a high lake above Yulla village.' },
  { id: 'beas-kund', name: 'Beas Kund', region: 'himachal', kind: 'Trek', lat: 32.32, lng: 77.1, grade: 'Easy', altitude: '12,772 ft', season: 'May – Oct', note: 'The source of the Beas, ringed by Hanuman Tibba and Friendship Peak.' },
  { id: 'kareri-lake', name: 'Kareri Lake', region: 'himachal', kind: 'Trek', lat: 32.32, lng: 76.28, grade: 'Easy', altitude: '9,650 ft', season: 'Mar – Jun, Sep – Nov', note: 'A shallow freshwater lake below the Dhauladhar, fed by Minkiani pass snow.' },
  { id: 'kheerganga', name: 'Kheerganga Trek', region: 'himachal', kind: 'Trek', lat: 31.98, lng: 77.42, grade: 'Easy', altitude: '9,700 ft', season: 'Mar – Nov', note: 'Parvati valley forest walk to the hot springs at the top.' },
  { id: 'manali-kasol-jibhi', name: 'Manali · Kasol · Jibhi', region: 'himachal', kind: 'Backpacking', lat: 32.24, lng: 77.19, season: 'Year round', note: 'Three Himachal bases with very different characters, in one trip.' },
  { id: 'mcleodganj-bir-triund', name: 'McLeodganj · Bir · Triund', region: 'himachal', kind: 'Backpacking', lat: 32.24, lng: 76.32, season: 'Mar – Jun, Sep – Nov', note: 'Kangra valley — monasteries, paragliding at Bir and a night on Triund.' },

  // ---------- Spiti ----------
  { id: 'spiti-full-circuit', name: 'Spiti Full Circuit from Delhi', region: 'spiti', kind: 'Backpacking', lat: 32.25, lng: 78.02, season: 'Jun – Oct', note: 'The full loop — monasteries, Chandratal and the Kunzum crossing.' },
  { id: 'winter-spiti', name: 'Winter Spiti Expedition', region: 'spiti', kind: 'Backpacking', lat: 32.23, lng: 78.07, season: 'Dec – Feb', note: 'Spiti at −20°C, in via Shimla and Kinnaur when the Kunzum road is shut.' },

  // ---------- Ladakh ----------
  { id: 'ladakh-leh-circuit', name: 'Ladakh — Leh Circuit', region: 'ladakh', kind: 'Backpacking', lat: 34.15, lng: 77.57, season: 'May – Sep', note: 'Leh, the Indus monasteries and the acclimatisation days that make the rest work.' },
  { id: 'ladakh-nubra-pangong', name: 'Ladakh — Nubra & Pangong', region: 'ladakh', kind: 'Backpacking', lat: 34.68, lng: 77.55, season: 'May – Sep', note: 'Over Khardung La to the Nubra dunes, then east to Pangong Tso.' },
  { id: 'ladakh-tso-moriri', name: 'Ladakh — Tso Moriri & Hanle', region: 'ladakh', kind: 'Backpacking', lat: 32.9, lng: 78.3, season: 'Jun – Sep', note: 'The high Changthang plateau, its lakes and the dark skies at Hanle.' },

  // ---------- Uttar Pradesh ----------
  { id: 'banaras', name: 'Banaras — Dev Deepawali', region: 'uttar-pradesh', kind: 'City & Culture', lat: 25.32, lng: 83.01, season: 'Nov (Dev Deepawali)', note: 'The ghats lit end to end on Kartik Purnima.' },
  { id: 'braj-backpack', name: 'Vrindavan · Ayodhya · Barsana · Khatu Shyam', region: 'uttar-pradesh', kind: 'City & Culture', lat: 27.58, lng: 77.7, season: 'Oct – Mar', note: 'The Braj temple towns, plus the Khatu Shyam shrine across the Rajasthan border.' },

  // ---------- Rajasthan ----------
  { id: 'royal-rajasthan', name: 'Jaipur · Udaipur · Jodhpur · Jaisalmer', region: 'rajasthan', kind: 'Backpacking', lat: 26.92, lng: 75.79, season: 'Oct – Mar', note: 'The four fort cities, finishing on the Thar dunes.' },
  { id: 'udaipur-mount-abu', name: 'Udaipur with Mount Abu', region: 'rajasthan', kind: 'City & Culture', lat: 24.58, lng: 73.68, season: 'Oct – Mar', note: 'Lake city and the only hill station in Rajasthan.' },
  { id: 'ranthambore', name: 'Ranthambore National Park', region: 'rajasthan', kind: 'Wildlife', lat: 26.02, lng: 76.5, season: 'Oct – Jun', note: 'Tiger safaris out of Sawai Madhopur, in the old Ranthambore fort country.' },

  // ---------- Maharashtra ----------
  { id: 'kalsubai', name: 'Kalsubai Peak', region: 'maharashtra', kind: 'Trek', lat: 19.6, lng: 73.71, grade: 'Moderate', altitude: '5,400 ft', season: 'Jun – Feb', note: 'The highest point in Maharashtra, ladders and all.' },
  { id: 'harihar-fort', name: 'Harihar Fort', region: 'maharashtra', kind: 'Trek', lat: 19.92, lng: 73.47, grade: 'Moderate', season: 'Jun – Feb', note: 'The near-vertical rock-cut staircase above Nashik.' },
  { id: 'harishchandragad', name: 'Harishchandragad', region: 'maharashtra', kind: 'Trek', lat: 19.39, lng: 73.77, grade: 'Difficult', altitude: '4,670 ft', season: 'Jun – Feb', note: 'Konkan Kada, the overhanging cliff, and a night on the plateau.' },
  { id: 'andharban', name: 'Andharban', region: 'maharashtra', kind: 'Trek', lat: 18.5, lng: 73.42, grade: 'Easy', season: 'Jun – Oct', note: 'A descending walk through dense monsoon forest into the Konkan.' },
  { id: 'rajmachi', name: 'Rajmachi', region: 'maharashtra', kind: 'Trek', lat: 18.79, lng: 73.42, grade: 'Easy', season: 'Jun – Feb', note: 'Twin forts above the Ulhas valley, walked overnight from Lonavala.' },
  { id: 'devkund', name: 'Devkund Waterfall', region: 'maharashtra', kind: 'Trek', lat: 18.42, lng: 73.42, grade: 'Easy', season: 'Jun – Oct', note: 'A plunge pool at the base of three converging falls.' },
  { id: 'sandhan-valley', name: 'Sandhan Valley', region: 'maharashtra', kind: 'Trek', lat: 19.55, lng: 73.7, grade: 'Difficult', season: 'Oct – May', note: 'A 200ft-deep canyon walked and rappelled end to end.' },
  { id: 'adrai-jungle', name: 'Adrai Jungle Waterfall', region: 'maharashtra', kind: 'Trek', lat: 19.7, lng: 73.3, grade: 'Moderate', season: 'Jun – Oct', note: 'A monsoon jungle trail to a stepped waterfall near Kasara.' },
  { id: 'ratangad', name: 'Ratangad', region: 'maharashtra', kind: 'Trek', lat: 19.51, lng: 73.68, grade: 'Moderate', altitude: '4,255 ft', season: 'Jun – Feb', note: 'The fort with the natural rock window, above Bhandardara lake.' },
  { id: 'amk', name: 'AMK — Alang Madan Kulang', region: 'maharashtra', kind: 'Trek', lat: 19.55, lng: 73.66, grade: 'Extreme', season: 'Oct – May', note: 'Three forts, technical rock sections and fixed ropes — our hardest Sahyadri route.' },
  { id: 'kalu-waterfall', name: 'Kalu Waterfall', region: 'maharashtra', kind: 'Trek', lat: 19.55, lng: 73.55, grade: 'Moderate', season: 'Jun – Oct', note: 'One of the tallest falls in the Sahyadris, in full monsoon flow.' },
  { id: 'nanemachi', name: 'Nanemachi Waterfall', region: 'maharashtra', kind: 'Trek', lat: 17.9, lng: 73.75, grade: 'Easy', season: 'Jun – Oct', note: 'A quiet waterfall trail in the Satara hills.' },
  { id: 'rajgad', name: 'Rajgad', region: 'maharashtra', kind: 'Trek', lat: 18.24, lng: 73.68, grade: 'Moderate', altitude: '4,514 ft', season: 'Jun – Feb', note: 'The first Maratha capital — Balekilla, Padmavati and three machis.' },
  { id: 'vasota', name: 'Vasota Fort', region: 'maharashtra', kind: 'Trek', lat: 17.72, lng: 73.72, grade: 'Moderate', season: 'Oct – May', note: 'Reached by boat across Shivsagar, then up through Koyna sanctuary forest.' },
  { id: 'bhandardara', name: 'Bhandardara', region: 'maharashtra', kind: 'Backpacking', lat: 19.53, lng: 73.75, season: 'Jun – Feb', note: 'Lakeside camping under Kalsubai, with bioluminescence in the monsoon.' },

  // ---------- Nepal ----------
  { id: 'kailash-mansarovar', name: 'Kailash Mansarovar Yatra 2027', region: 'nepal', kind: 'Yatra', lat: 31.07, lng: 81.31, altitude: '18,500 ft', season: 'May – Sep 2027', note: 'The parikrama of Mount Kailash and Lake Mansarovar, via Kathmandu.' },
  { id: 'nepal-ktm-pokhara', name: 'Kathmandu & Pokhara', region: 'nepal', kind: 'Backpacking', lat: 27.71, lng: 85.32, season: 'Year round', note: 'The two anchor cities — durbar squares and Phewa lake.' },
  { id: 'nepal-nagarkot', name: 'Nagarkot · Kathmandu · Pokhara', region: 'nepal', kind: 'Backpacking', lat: 27.72, lng: 85.52, season: 'Year round', note: 'Adds the Nagarkot ridge for the Himalayan sunrise line.' },
  { id: 'nepal-chitwan', name: 'Kathmandu · Pokhara · Chitwan', region: 'nepal', kind: 'Wildlife', lat: 27.58, lng: 84.5, season: 'Oct – Mar', note: 'Ends in the Terai grasslands — rhino, gharial and elephant country.' },
  { id: 'nepal-jomsom', name: 'Kathmandu · Pokhara · Jomsom', region: 'nepal', kind: 'Backpacking', lat: 28.78, lng: 83.72, season: 'Mar – Nov', note: 'Up the Kali Gandaki gorge to Mustang’s doorstep.' },
  { id: 'abc-trek', name: 'Annapurna Base Camp', region: 'nepal', kind: 'Trek', lat: 28.53, lng: 83.88, grade: 'Moderate', altitude: '13,550 ft', season: 'Mar – May, Oct – Nov', note: 'Into the Annapurna sanctuary, ringed by 7,000m walls.' },
  { id: 'nepal-community', name: 'Nepal Community Trip', region: 'nepal', kind: 'Yatra', lat: 27.71, lng: 85.35, season: 'Year round', note: 'A group departure built around Pashupatinath and the Kathmandu valley.' },

  // ---------- International ----------
  { id: 'dubai', name: 'Dubai', region: 'international', kind: 'City & Culture', lat: 25.2, lng: 55.27, season: 'Nov – Mar', note: 'Desert and skyline — the short-haul city break.' },
  { id: 'bali', name: 'Bali', region: 'international', kind: 'Backpacking', lat: -8.34, lng: 115.09, season: 'Apr – Oct', note: 'Ubud, the east coast and the volcano sunrise walks.' },
  { id: 'thailand', name: 'Thailand', region: 'international', kind: 'Backpacking', lat: 13.75, lng: 100.5, season: 'Nov – Mar', note: 'Bangkok, the north, and the islands on either coast.' },
]

export function journeysByRegion(regionId) {
  return journeys.filter((j) => j.region === regionId)
}

export function getRegion(regionId) {
  return regions.find((r) => r.id === regionId)
}

export const journeyCount = journeys.length
