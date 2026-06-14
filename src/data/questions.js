// ============================================================
//  DATA.JS — Question Bank (160 Questions) + Category Config
// ============================================================

export const CATEGORIES = {
  general: {
    id: 'general', name: 'General Music', emoji: '🎵', shortName: 'General',
    difficulty: 'Medium', questionCount: 40,
    description: 'All genres, all eras — the ultimate music test',
    colorA: '#7c3aed', colorB: '#2563eb',
    gradient: 'linear-gradient(135deg, #4c1d95, #1d4ed8)',
    glow: 'rgba(124,58,237,0.5)', barColor: 'linear-gradient(90deg,#7c3aed,#2563eb)',
    gameGradient: 'linear-gradient(135deg,rgba(76,29,149,0.6),rgba(29,78,216,0.4))',
    timerColor: '#a855f7',
  },
  pop: {
    id: 'pop', name: 'Pop Music', emoji: '🌟', shortName: 'Pop',
    difficulty: 'Easy', questionCount: 40,
    description: 'Chart-toppers, superstars and iconic hits',
    colorA: '#ec4899', colorB: '#f59e0b',
    gradient: 'linear-gradient(135deg, #9d174d, #b45309)',
    glow: 'rgba(236,72,153,0.5)', barColor: 'linear-gradient(90deg,#ec4899,#f59e0b)',
    gameGradient: 'linear-gradient(135deg,rgba(157,23,77,0.6),rgba(180,83,9,0.4))',
    timerColor: '#ec4899',
  },
  hiphop: {
    id: 'hiphop', name: 'Hip Hop', emoji: '🎤', shortName: 'Hip Hop',
    difficulty: 'Medium', questionCount: 40,
    description: 'From Bronx origins to global domination',
    colorA: '#1a1a2e', colorB: '#f97316',
    gradient: 'linear-gradient(135deg, #111827, #7c2d12)',
    glow: 'rgba(249,115,22,0.5)', barColor: 'linear-gradient(90deg,#f97316,#ea580c)',
    gameGradient: 'linear-gradient(135deg,rgba(17,24,39,0.85),rgba(124,45,18,0.6))',
    timerColor: '#f97316',
  },
  afrobeats: {
    id: 'afrobeats', name: 'Afrobeats', emoji: '🌍', shortName: 'Afrobeats',
    difficulty: 'Hard', questionCount: 40,
    description: 'Vibrant rhythms, African energy and culture',
    colorA: '#d97706', colorB: '#059669',
    gradient: 'linear-gradient(135deg, #92400e, #065f46)',
    glow: 'rgba(217,119,6,0.5)', barColor: 'linear-gradient(90deg,#d97706,#059669)',
    gameGradient: 'linear-gradient(135deg,rgba(146,64,14,0.7),rgba(6,95,70,0.5))',
    timerColor: '#f59e0b',
  },
  artistSpotlight: {
    id: 'artistSpotlight', name: 'Artist Spotlight', emoji: '🕺', shortName: 'MJ Spotlight',
    difficulty: 'Easy', questionCount: 20,
    description: 'Michael Jackson — the King of Pop and his legendary legacy',
    subtitle: 'Michael Jackson',
    colorA: '#d97706', colorB: '#7c3aed',
    gradient: 'linear-gradient(135deg, #78350f, #4c1d95)',
    glow: 'rgba(217,119,6,0.6)', barColor: 'linear-gradient(90deg,#d97706,#7c3aed)',
    gameGradient: 'linear-gradient(135deg,rgba(120,53,15,0.7),rgba(76,29,149,0.5))',
    timerColor: '#f59e0b',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export const QUESTIONS = {
  general: [
    // Level 1-3 Easy pool
    { q:'Which of these is a music artist?', a:['A microwave','Taylor Swift','A bicycle','A calculator'], correct:1 },
    { q:'Which instrument has black and white keys?', a:['Guitar','Drums','Piano','Violin'], correct:2 },
    { q:'What do singers use to sing into?', a:['Headphones','Microphone','Speaker','Turntable'], correct:1 },
    { q:'Which app is commonly used to listen to music?', a:['Spotify','Microsoft Word','Google Maps','Calculator'], correct:0 },
    
    { q:'Which artist sang "Shape of You"?', a:['Sam Smith','Ed Sheeran','Harry Styles','Drake'], correct:1 },
    { q:'Which instrument typically has six strings?', a:['Trumpet','Flute','Drums','Guitar'], correct:3 },
    { q:'What does a DJ typically play?', a:['Music tracks','Video games','Sports','Movies'], correct:0 },
    { q:'What do we call a collection of songs released together?', a:['A book','A playlist','An album','A chapter'], correct:2 },
    
    { q:'Which genre is Burna Boy most associated with?', a:['Country','Classical','Afrobeats','Rock'], correct:2 },
    { q:'Which artist is known as the "King of Pop"?', a:['Prince','Elvis Presley','Michael Jackson','Stevie Wonder'], correct:2 },
    { q:'What is the name of a song\'s repeated section?', a:['Verse','Chorus','Bridge','Intro'], correct:1 },
    { q:'Which platform is primarily used for music streaming?', a:['Apple Music','Netflix','Uber','Zoom'], correct:0 },
    
    // Normal questions
    { q:'What genre of music is Bob Marley famous for?', a:['Rock','Jazz','Reggae','Blues'], correct:2 },
    { q:'Which of these is a brass instrument?', a:['Violin','Trumpet','Piano','Clarinet'], correct:1 },
    { q:'Who sang "Rolling in the Deep"?', a:['Beyoncé','Rihanna','Adele','Amy Winehouse'], correct:2 },
    { q:'"Shape of You" was a hit by which artist?', a:['Sam Smith','Ed Sheeran','Harry Styles','James Arthur'], correct:1 },
    { q:'Which female artist sang "Crazy in Love"?', a:['Rihanna','Beyoncé','Alicia Keys','Mariah Carey'], correct:1 },
    { q:'What music genre originated in Jamaica?', a:['Blues','Jazz','Reggae','Ska'], correct:2 },
    { q:'Who is the lead singer of U2?', a:['The Edge','Adam Clayton','Larry Mullen Jr.','Bono'], correct:3 },
    { q:'Who sang "Billie Jean"?', a:['Prince','Michael Jackson','Stevie Wonder','James Brown'], correct:1 },
    { q:'Which rapper is known as "Slim Shady"?', a:['Jay-Z','Kanye West','Eminem','Lil Wayne'], correct:2 },
    { q:'Who sang "Purple Rain"?', a:['Prince','David Bowie','Jimi Hendrix','Stevie Wonder'], correct:0 },
    { q:'Which artist is known as "The Boss"?', a:['Tom Petty','Bruce Springsteen','Bob Dylan','Neil Young'], correct:1 },
    { q:'Which artist released the album "Rumours"?', a:['Carole King','Fleetwood Mac','Eagles','Joni Mitchell'], correct:1 },
    { q:'Who wrote "Imagine"?', a:['Paul McCartney','John Lennon','George Harrison','Yoko Ono'], correct:1 },
    { q:'Who is known as the "Queen of Soul"?', a:['Whitney Houston','Tina Turner','Aretha Franklin','Diana Ross'], correct:2 },
    { q:'"Superstition" is a hit by which artist?', a:['Marvin Gaye','Stevie Wonder','Al Green','James Brown'], correct:1 },
    { q:'"My Heart Will Go On" is the theme from which movie?', a:['Ghost','The Bodyguard','Titanic','Pretty Woman'], correct:2 },
    { q:'Which country does the band ABBA come from?', a:['Norway','Denmark','Finland','Sweden'], correct:3 },
    { q:'In music, "BPM" stands for?', a:['Beats Per Minute','Bass Production Mix','Beat Pattern Meter','Base Phase Modulation'], correct:0 },
    { q:'Which artist is known for the song "Jolene"?', a:['Loretta Lynn','Tammy Wynette','Dolly Parton','Patsy Cline'], correct:2 },
    { q:'Who sang "What\'s Going On" (1971)?', a:['Marvin Gaye','Stevie Wonder','Otis Redding','Al Green'], correct:0 },
    { q:'Which guitarist was known as "Slowhand"?', a:['Jimmy Page','Jimi Hendrix','Eric Clapton','Carlos Santana'], correct:2 },
    { q:'Which streaming service has the most subscribers?', a:['Apple Music','Amazon Music','Tidal','Spotify'], correct:3 },
    { q:'What is the best-selling album of all time?', a:['Dark Side of the Moon','Thriller','Back in Black','Eagles Greatest Hits'], correct:1 },
    { q:'What is a musical piece played by three musicians called?', a:['Duet','Quartet','Quintet','Trio'], correct:3 },
    { q:'Which decade saw the birth of hip hop?', a:['1960s','1970s','1980s','1990s'], correct:1 },
    { q:'Which year was the first Grammy Awards held?', a:['1959','1961','1955','1963'], correct:0 },
    { q:'What is the lowest voice range in classical singing?', a:['Baritone','Tenor','Bass','Countertenor'], correct:2 },
    { q:'Who sang "We Are the World"?', a:['Michael Jackson only','Various Artists (USA for Africa)','Lionel Richie only','Quincy Jones'], correct:1 },
    { q:'Which artist sang "Jolene" and "9 to 5"?', a:['Loretta Lynn','Dolly Parton','Patsy Cline','Crystal Gayle'], correct:1 },
    { q:'"Happy Birthday to You" was composed in which century?', a:['17th','18th','19th','20th'], correct:2 },
    { q:'The term "a cappella" means singing?', a:['Softly','Without instruments','In Italian','In chorus'], correct:1 },
    { q:'Which instrument does Yo-Yo Ma play?', a:['Violin','Cello','Viola','Double Bass'], correct:1 },
    { q:'Which artist recorded "Born to Run"?', a:['Tom Petty','Bruce Springsteen','Bob Dylan','Neil Young'], correct:1 },
  ],
  pop: [
    { q:'Which of these is a pop music artist?', a:['A microwave','Ariana Grande','A bicycle','A calculator'], correct:1 },
    { q:'Which instrument has black and white keys?', a:['Guitar','Drums','Piano','Violin'], correct:2 },
    { q:'What do singers use to sing into?', a:['Headphones','Microphone','Speaker','Turntable'], correct:1 },
    { q:'Which app is commonly used to listen to pop music?', a:['Spotify','Microsoft Word','Google Maps','Calculator'], correct:0 },
    
    { q:'Which artist sang "Shape of You"?', a:['Sam Smith','Ed Sheeran','Harry Styles','Drake'], correct:1 },
    { q:'Which instrument typically has six strings?', a:['Trumpet','Flute','Drums','Guitar'], correct:3 },
    { q:'What does a DJ typically play?', a:['Music tracks','Video games','Sports','Movies'], correct:0 },
    { q:'What do we call a collection of songs released together?', a:['A book','A playlist','An album','A chapter'], correct:2 },
    
    { q:'Who is known as the "Queen of Pop"?', a:['Celine Dion','Mariah Carey','Madonna','Whitney Houston'], correct:2 },
    { q:'Which artist is known as the "King of Pop"?', a:['Prince','Elvis Presley','Michael Jackson','Stevie Wonder'], correct:2 },
    { q:'What is the name of a song\'s repeated section?', a:['Verse','Chorus','Bridge','Intro'], correct:1 },
    { q:'Which platform is primarily used for music streaming?', a:['Apple Music','Netflix','Uber','Zoom'], correct:0 },
    
    { q:'Who sang "Shake It Off"?', a:['Katy Perry','Taylor Swift','Selena Gomez','Ariana Grande'], correct:1 },
    { q:'Which artist sings "Sorry"?', a:['Shawn Mendes','Zayn','Justin Bieber','Charlie Puth'], correct:2 },
    { q:'Who was a member of One Direction?', a:['Justin Bieber','Harry Styles','Shawn Mendes','Ed Sheeran'], correct:1 },
    { q:'"Happy" is a hit by which artist?', a:['Bruno Mars','Pharrell Williams','Ne-Yo','Jason Derulo'], correct:1 },
    { q:'Olivia Rodrigo\'s debut album is called?', a:['Guts','Sour','Good 4 U','Driver\'s License'], correct:1 },
    { q:'Harry Styles was previously part of which group?', a:['The Wanted','One Direction','5 Seconds of Summer','The Vamps'], correct:1 },
    { q:'"As It Was" was released by which artist?', a:['Niall Horan','Zayn','Liam Payne','Harry Styles'], correct:3 },
    { q:'Who performed at the Super Bowl Halftime Show in 2023?', a:['Beyoncé','Lady Gaga','Jennifer Lopez','Rihanna'], correct:3 },
    { q:'Who sang "Toxic"?', a:['Britney Spears','Christina Aguilera','Pink','Nelly Furtado'], correct:0 },
    { q:'Mariah Carey\'s "All I Want for Christmas" was released in?', a:['1992','1993','1994','1995'], correct:2 },
    { q:'Which artist is known for the alter ego "Sasha Fierce"?', a:['Rihanna','Lady Gaga','Beyoncé','Nicki Minaj'], correct:2 },
    { q:'"Levitating" is a hit by which pop star?', a:['Cardi B','Doja Cat','Dua Lipa','Lizzo'], correct:2 },
    { q:'"Stay" is a 2021 hit by which artists?', a:['The Kid LAROI & Justin Bieber','Shawn Mendes & Camila Cabello','BTS & Halsey','Dua Lipa & Doja Cat'], correct:0 },
    { q:'Who sang "Rolling in the Deep"?', a:['Adele','Amy Winehouse','Sam Smith','Lorde'], correct:0 },
    { q:'"Call Me Maybe" was a hit by?', a:['Carly Rae Jepsen','Katy Perry','Ke$ha','Nicki Minaj'], correct:0 },
    { q:'What year did "Gangnam Style" go viral?', a:['2010','2011','2012','2013'], correct:2 },
    { q:'Who is known as "Queen of Pop"?', a:['Celine Dion','Mariah Carey','Madonna','Whitney Houston'], correct:2 },
    { q:'"Umbrella" is a hit by which artist?', a:['Ciara','Beyoncé','Rihanna','Alicia Keys'], correct:2 },
    { q:'Which artist released the album "1989"?', a:['Katy Perry','Taylor Swift','Lady Gaga','Selena Gomez'], correct:1 },
    { q:'Who sings "Dynamite" (2020)?', a:['EXO','BTS','Blackpink','Stray Kids'], correct:1 },
    { q:'Who sang "Chandelier"?', a:['Adele','P!nk','Sia','Florence Welch'], correct:2 },
    { q:'"Blinding Lights" is a hit by which artist?', a:['Drake','The Weeknd','Post Malone','J Balvin'], correct:1 },
    { q:'Which artist\'s debut single was "driver\'s license"?', a:['Gracie Abrams','Olivia Rodrigo','Sabrina Carpenter','Conan Gray'], correct:1 },
    { q:'"Roar" is a hit by which pop star?', a:['Taylor Swift','Pink','Katy Perry','Miley Cyrus'], correct:2 },
    { q:'Which Beyoncé album was released as a visual album?', a:['4','Lemonade','Renaissance','Beyoncé'], correct:3 },
    { q:'"Wrecking Ball" is a song by?', a:['Miley Cyrus','Kesha','Halsey','Bebe Rexha'], correct:0 },
    { q:'Who sang "Closer" with The Chainsmokers?', a:['Dua Lipa','Camila Cabello','Halsey','Carly Rae Jepsen'], correct:2 },
    { q:'"Shallow" is from which movie?', a:['A Star Is Born','Bohemian Rhapsody','Rocketman','Yesterday'], correct:0 },
    { q:'Who collaborated with Ed Sheeran on "Perfect Symphony"?', a:['Andrea Bocelli','Celine Dion','Josh Groban','Il Volo'], correct:0 },
    { q:'"7 rings" is by which artist?', a:['Dua Lipa','Selena Gomez','Ariana Grande','Cardi B'], correct:2 },
    { q:'Which artist has the alter ego "Roman Zolanski"?', a:['Cardi B','Nicki Minaj','Iggy Azalea','Azealia Banks'], correct:1 },
    { q:'Who sang "Hips Don\'t Lie"?', a:['Jennifer Lopez','Beyoncé','Shakira','Rihanna'], correct:2 },
    { q:'"Bad Romance" is by which artist?', a:['Rihanna','Beyoncé','Lady Gaga','Ke$ha'], correct:2 },
  ],
  hiphop: [
    { q:'Which of these is a hip hop artist?', a:['A microwave','Drake','A bicycle','A calculator'], correct:1 },
    { q:'Which instrument has black and white keys?', a:['Guitar','Drums','Piano','Violin'], correct:2 },
    { q:'What do rappers use to rap into?', a:['Headphones','Microphone','Speaker','Turntable'], correct:1 },
    { q:'Which app is commonly used to listen to hip hop?', a:['Spotify','Microsoft Word','Google Maps','Calculator'], correct:0 },
    
    { q:'Which artist sang "Hotline Bling"?', a:['The Weeknd','Justin Bieber','Drake','Tory Lanez'], correct:2 },
    { q:'Which instrument typically has six strings?', a:['Trumpet','Flute','Drums','Guitar'], correct:3 },
    { q:'What does a DJ typically play?', a:['Music tracks','Video games','Sports','Movies'], correct:0 },
    { q:'What do we call a collection of songs released together?', a:['A book','A playlist','An album','A chapter'], correct:2 },
    
    { q:'Which rapper is married to Beyoncé?', a:['Kanye West','Jay-Z','Diddy','Nas'], correct:1 },
    { q:'Who is known as "Slim Shady"?', a:['Lil Wayne','Eminem','50 Cent','DMX'], correct:1 },
    { q:'What is the name of a song\'s repeated section?', a:['Verse','Chorus','Bridge','Intro'], correct:1 },
    { q:'Which platform is primarily used for music streaming?', a:['Apple Music','Netflix','Uber','Zoom'], correct:0 },

    { q:'Which genre is Eminem famous for?', a:['Hip Hop','Country','Classical','Opera'], correct:0 },
    { q:'Which of these is a famous rapper?', a:['Drake','A microwave','A chair','A pencil'], correct:0 },
    { q:'What country is the rapper Drake from?', a:['Canada','Japan','Australia','Germany'], correct:0 },
    { q:'Which rapper is famous for "Drop It Like It\'s Hot"?', a:['Snoop Dogg','Mozart','Taylor Swift','Beethoven'], correct:0 },
    { q:'"Sicko Mode" features which rapper alongside Travis Scott?', a:['Drake','Lil Baby','Gunna','21 Savage'], correct:0 },
    { q:'Nicki Minaj is originally from which country?', a:['Jamaica','Barbados','Trinidad and Tobago','Guyana'], correct:2 },
    { q:'Which rapper\'s full name is Aubrey Drake Graham?', a:['Lil Uzi Vert','Drake','Lil Durk','6ix9ine'], correct:1 },
    { q:'Cardi B and Bruno Mars collaborated on which hit?', a:['That\'s What I Like','Finesse','Uptown Funk','24K Magic'], correct:1 },
    { q:'Who released "Gold Digger" featuring Jamie Foxx?', a:['Jay-Z','Kanye West','T.I.','Lil Wayne'], correct:1 },
    { q:'Which rapper is known as "The God MC"?', a:['Biggie','Rakim','Nas','KRS-One'], correct:1 },
    { q:'"All Eyez on Me" is a double album by which rapper?', a:['Biggie Smalls','Jay-Z','Tupac Shakur','Snoop Dogg'], correct:2 },
    { q:'Which rap group featured Ice Cube, Dr. Dre, and Eazy-E?', a:['Wu-Tang Clan','Public Enemy','N.W.A','A Tribe Called Quest'], correct:2 },
    { q:'Who is the head of label Roc Nation?', a:['Diddy','Jay-Z','Kanye West','Rick Ross'], correct:1 },
    { q:'"The Miseducation of Lauryn Hill" was released in which year?', a:['1996','1997','1998','1999'], correct:2 },
    { q:'Eminem\'s autobiographical movie is called?', a:['Straight Outta Compton','Hustle & Flow','8 Mile','Get Rich or Die Tryin\''], correct:2 },
    { q:'Who produced the iconic track "Nuthin\' But a G Thang"?', a:['Timbaland','Dr. Dre','DJ Premier','Pharrell'], correct:1 },
    { q:'"Still D.R.E." features which rapper?', a:['Snoop Dogg','Eminem','2Pac','Ice Cube'], correct:0 },
    { q:'Which rapper released "My Beautiful Dark Twisted Fantasy"?', a:['Jay-Z','J. Cole','Drake','Kanye West'], correct:3 },
    { q:'Lil Nas X\'s "Old Town Road" spent how many weeks at #1?', a:['12','15','17','19'], correct:3 },
    { q:'Biggie Smalls was from which borough?', a:['The Bronx','Queens','Brooklyn','Manhattan'], correct:2 },
    { q:'Which hip hop group released "C.R.E.A.M."?', a:['Outkast','Wu-Tang Clan','Mobb Deep','Gang Starr'], correct:1 },
    { q:'Which rapper album "To Pimp a Butterfly" won a Grammy?', a:['J. Cole','Drake','Kanye West','Kendrick Lamar'], correct:3 },
    { q:'"God\'s Plan" is a hit by which rapper?', a:['Post Malone','Drake','Lil Baby','Roddy Ricch'], correct:1 },
    { q:'Outkast is from which city?', a:['Houston','New Orleans','Atlanta','Miami'], correct:2 },
    { q:'Who is known as "Hov" in the hip hop world?', a:['Nas','Jay-Z','Big Pun','KRS-One'], correct:1 },
    { q:'Travis Scott\'s real name is?', a:['Scott Okonkwo','Jacques Berman Webster II','Londell Jasmine','Lamar Okafor'], correct:1 },
    { q:'Which rapper co-founded Death Row Records?', a:['Suge Knight only','Suge Knight & Dr. Dre','Dr. Dre only','Snoop Dogg & Dr. Dre'], correct:1 },
    { q:'"In Da Club" by 50 Cent was produced by?', a:['Timbaland','DJ Premier','Dr. Dre','Kanye West'], correct:2 },
    { q:'Meek Mill and who had a famous rap beef?', a:['Kendrick Lamar','Drake','J. Cole','Logic'], correct:1 },
    { q:'"Alright" by Kendrick Lamar became an anthem for which movement?', a:['Anti-War','LGBTQ+','Black Lives Matter','Occupy'], correct:2 },
    { q:'Cardi B\'s first Grammy win was for which category?', a:['Best New Artist','Best Rap Song','Best Rap Album','Best Melodic Rap Performance'], correct:2 },
    { q:'Who is known as "Young Money"\'s founder?', a:['Drake','Nicki Minaj','Tyga','Lil Wayne'], correct:3 },
    { q:'"Bodak Yellow" sampled a song by which rapper?', a:['Kodak Black','Migos','Future','21 Savage'], correct:0 },
  ],
  afrobeats: [
    { q:'Which of these is an Afrobeats artist?', a:['A microwave','WizKid','A bicycle','A calculator'], correct:1 },
    { q:'Which instrument has black and white keys?', a:['Guitar','Drums','Piano','Violin'], correct:2 },
    { q:'What do singers use to sing into?', a:['Headphones','Microphone','Speaker','Turntable'], correct:1 },
    { q:'Which app is commonly used to listen to music?', a:['Spotify','Microsoft Word','Google Maps','Calculator'], correct:0 },
    
    { q:'Who sings the global hit "Calm Down"?', a:['Fireboy DML','WizKid','Rema','Davido'], correct:2 },
    { q:'Which instrument typically has six strings?', a:['Trumpet','Flute','Drums','Guitar'], correct:3 },
    { q:'What does a DJ typically play?', a:['Music tracks','Video games','Sports','Movies'], correct:0 },
    { q:'What do we call a collection of songs released together?', a:['A book','A playlist','An album','A chapter'], correct:2 },
    
    { q:'Which genre is Burna Boy most associated with?', a:['Country','Classical','Afrobeats','Rock'], correct:2 },
    { q:'Who is known as the "African Giant"?', a:['WizKid','Davido','Burna Boy','Mr Eazi'], correct:2 },
    { q:'What is the name of a song\'s repeated section?', a:['Verse','Chorus','Bridge','Intro'], correct:1 },
    { q:'Which platform is primarily used for music streaming?', a:['Apple Music','Netflix','Uber','Zoom'], correct:0 },

    { q:'Which Nigerian artist sang "Essence"?', a:['Davido','Burna Boy','WizKid','Fireboy DML'], correct:2 },
    { q:'Burna Boy is an artist from which continent?', a:['Africa','Europe','Asia','South America'], correct:0 },
    { q:'Which of these is a famous Afrobeats star?', a:['Burna Boy','A dishwasher','A skateboard','A toaster'], correct:0 },
    { q:'Which instrument is most essential to Afrobeats rhythms?', a:['Drums','Violin','Harp','Flute'], correct:0 },
    { q:'Patoranking is associated with which musical style?', a:['Afropop only','Reggae/Dancehall only','Afrobeats and Reggae','R&B and Afrobeats'], correct:2 },
    { q:'Which year did WizKid release "Superstar"?', a:['2010','2011','2012','2013'], correct:1 },
    { q:'"Sungba" is a collaboration between Asake and which artist?', a:['WizKid','Burna Boy','Davido','Rema'], correct:1 },
    { q:'"Calm Down" is a global hit by which Nigerian artist?', a:['Fireboy DML','WizKid','Rema','Davido'], correct:2 },
    { q:'Amapiano is a music genre that originated in which country?', a:['Nigeria','Kenya','Ghana','South Africa'], correct:3 },
    { q:'Which Afrobeats artist released "A Good Time"?', a:['WizKid','Davido','Fireboy DML','Mr Eazi'], correct:1 },
    { q:'Tems was featured on which WizKid song?', a:['Ojuelegba','Fever','Essence','Made in Lagos'], correct:2 },
    { q:'"Terminator" is a hit by which Nigerian artist?', a:['Fireboy DML','Ayra Starr','Rema','Asake'], correct:0 },
    { q:'Burna Boy collaborated with which reggae artist on "Sitting on Top of the World"?', a:['Ziggy Marley','Damian Marley','Julian Marley','Ky-Mani Marley'], correct:1 },
    { q:'"Champion" is a collaboration between Burna Boy and?', a:['Davido','Tiwa Savage','WizKid','Mr Eazi'], correct:2 },
    { q:'Which Nigerian artist released "Organise"?', a:['Tems','Ayra Starr','Omah Lay','Oxlade'], correct:2 },
    { q:'Afrobeats artist Rema is from which Nigerian state?', a:['Lagos','Rivers','Edo','Ogun'], correct:2 },
    { q:'Which female Afrobeats artist released "Rush"?', a:['Tiwa Savage','Tems','Yemi Alade','Ayra Starr'], correct:3 },
    { q:'"Buga" is a hit track by Kizz Daniel featuring?', a:['Davido','WizKid','Tekno','Burna Boy'], correct:2 },
    { q:'WizKid\'s "Made in Lagos" album was released in which year?', a:['2019','2020','2021','2022'], correct:1 },
    { q:'Which Afrobeats artist performed at Coachella 2023?', a:['Burna Boy','WizKid','Davido','Tems'], correct:0 },
    { q:'Olamide is associated with which Nigerian record label?', a:['DMW','Star Boy Records','YBNL Nation','Mavins'], correct:2 },
    { q:'"Bloody Samaritan" is a hit by which Afrobeats artist?', a:['Tems','Tiwa Savage','Ayra Starr','Yemi Alade'], correct:2 },
    { q:'Asake\'s debut album is called?', a:['Mr Money With the Vibe','Lungu Boy','Work of Art','Sungba'], correct:0 },
    { q:'"Electricity" is a collaboration between WizKid and?', a:['Skepta','Drake','Burna Boy','Chance the Rapper'], correct:0 },
    { q:'"Fall" by Davido spent how many weeks on Billboard?', a:['60','72','82','92'], correct:3 },
    { q:'The word "Afrobeats" was popularized by which DJ?', a:['DJ Spinall','DJ Cuppy','DJ Abrantee','DJ Neptunes'], correct:2 },
    { q:'"Champion" (2012) is from which Burna Boy project?', a:['L.I.F.E.','Outside','African Giant','On a Spaceship'], correct:0 },
    { q:'Afrobeats blends traditional African music with which genres?', a:['Rock and Country','Jazz and Classical','Hip hop, R&B and Pop','Blues and Soul'], correct:2 },
    { q:'Which Afrobeats artist released "Joha"?', a:['Burna Boy','WizKid','Davido','Femi Kuti'], correct:0 },
    { q:'Afrobeats producer Shizzi has worked most with?', a:['WizKid','Davido','Burna Boy','Olamide'], correct:1 },
    { q:'"Bank on It" is from Beyoncé\'s African-inspired album called?', a:['The Lion King: The Gift','Black Is King','Lemonade','Renaissance'], correct:0 },
    { q:'Mr Eazi\'s viral song "Pour Me Water" became popular in which year?', a:['2013','2015','2017','2019'], correct:1 },
    { q:'CKay\'s "Love Nwantiti" reached the top 10 in how many countries?', a:['Over 50','Over 70','Over 90','Over 100'], correct:2 },
  ],
  artistSpotlight: [
    // Level 1-3 Easy pool (first 16 questions)
    { q:'Michael Jackson is known as the King of what?', a:['Rock','Jazz','Pop','Soul'], correct:2 },
    { q:'Which country was Michael Jackson from?', a:['UK','Australia','Canada','USA'], correct:3 },
    { q:'Michael Jackson was part of which famous family group?', a:['The Supremes','The Temptations','The Osmonds','The Jackson 5'], correct:3 },
    { q:'Which Michael Jackson album is the best-selling of all time?', a:['Bad','Dangerous','Off the Wall','Thriller'], correct:3 },

    { q:'What is the name of Michael Jackson\'s iconic dance move?', a:['The Robot','The Shuffle','The Moonwalk','The Twist'], correct:2 },
    { q:'Michael Jackson wore a sparkly glove on which hand?', a:['Both hands','Left hand','Right hand','Neither'], correct:2 },
    { q:'What was the name of Michael Jackson\'s famous estate?', a:['Graceland','Neverland Ranch','Paisley Park','Hearst Castle'], correct:1 },
    { q:'The "Thriller" music video was released in which decade?', a:['1970s','1980s','1990s','2000s'], correct:1 },

    { q:'What was the name of Michael Jackson\'s pet chimpanzee?', a:['Waffles','Biscuit','Sparky','Bubbles'], correct:3 },
    { q:'Michael Jackson was born in which US state?', a:['California','New York','Texas','Indiana'], correct:3 },
    { q:'Which song contains the lyric "Billie Jean is not my lover"?', a:['Beat It','Smooth Criminal','Billie Jean','Thriller'], correct:2 },
    { q:'Michael Jackson\'s first solo number one hit was which song?', a:['Thriller','Billie Jean','Beat It','Don\'t Stop \'Til You Get Enough'], correct:3 },

    { q:'Who directed the iconic "Thriller" music video?', a:['Steven Spielberg','Tim Burton','John Landis','Martin Scorsese'], correct:2 },
    { q:'Michael Jackson first performed the moonwalk publicly on which TV special?', a:['The Ed Sullivan Show','American Bandstand','The Tonight Show','Motown 25'], correct:3 },
    { q:'What colour jacket did Michael Jackson wear in the "Thriller" video?', a:['Black','White','Blue','Red'], correct:3 },
    { q:'Which Michael Jackson song features the lyric "Just beat it"?', a:['Billie Jean','Dangerous','Beat It','Bad'], correct:2 },

    // Normal pool (remaining questions)
    { q:'How many Grammy Awards did Michael Jackson win in his career?', a:['8','13','17','21'], correct:1 },
    { q:'Michael Jackson\'s "Bad" album was released in which year?', a:['1983','1985','1987','1989'], correct:2 },
    { q:'Which Michael Jackson song begins with "Annie are you OK"?', a:['Thriller','Billie Jean','Beat It','Smooth Criminal'], correct:3 },
    { q:'Michael Jackson co-wrote "We Are the World" with which artist?', a:['Quincy Jones','Lionel Richie','Prince','Stevie Wonder'], correct:1 },
  ],
};

export function getQuestionsForLevel(category, usedIndices = [], level = 1) {
  const pool = QUESTIONS[category] || [];
  
  // Sort pool logically based on level
  // For Levels 1-3, we pull strictly from the first 16 questions (which are easier)
  // For later levels, we expand the pool
  const maxIdx = level <= 3 ? 16 : pool.length;
  
  const available = pool
    .map((q, i) => ({ ...q, originalIndex: i }))
    .filter(q => !usedIndices.includes(q.originalIndex) && q.originalIndex < maxIdx);

  // Fallback to all questions if somehow available is empty (shouldn't happen unless player plays a LOT)
  const finalAvailable = available.length >= 4 ? available : pool
    .map((q, i) => ({ ...q, originalIndex: i }))
    .filter(q => !usedIndices.includes(q.originalIndex));

  const shuffled = [...finalAvailable].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 4);

  return selected.map(q => {
    const answers = [...q.a];
    const correctAnswer = answers[q.correct];
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return {
      question: q.q,
      answers,
      correctIndex: answers.indexOf(correctAnswer),
      originalIndex: q.originalIndex,
    };
  });
}
