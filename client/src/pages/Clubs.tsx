import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Users, Mail, Calendar, Filter, X, ChevronDown, ChevronUp } from "lucide-react";

interface Club {
  id: number;
  name: string;
  dateApproved: string;
  expirationDate: string;
  purpose: string;
  type: string;
  contactPerson: string;
  email: string;
}

const clubsData: Club[] = [
  {
    "id": 1,
    "name": "Accounting Club",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization shall be: A. To provide members with opportunities for academic, personal, and professional development so they may contribute effectively and ethically to society and their organizations B. To serve the community and develop conscientious members of the community th",
    "type": "Academic/Professional",
    "contactPerson": "Britney Pham",
    "email": "phambrit@hawaii.edu"
  },
  {
    "id": 2,
    "name": "Addiction Medicine and Harm Reduction Interest Group",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization is to increase student understanding of harm reduction principles and practices in the context of addiction medicine and public health, with a particular focus on Hawaii-specific challenges and resources. A vital aspect of our aim is to include Indigenous and cultura",
    "type": "Academic/Professional",
    "contactPerson": "Jewel Ito",
    "email": "jewelito@hawaii.edu"
  },
  {
    "id": 3,
    "name": "Advocates for Public Interest Law",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the organization is to support and promote the commitment of the students, alumni of the William S. Richardson School of Law, and the legal community to serve the public interest and to encourage the practice of public interest law. The purpose of the organization shall be accomplishe",
    "type": "Academic/Professional",
    "contactPerson": "Sumin Kim",
    "email": "sumink3@hawaii.edu"
  },
  {
    "id": 4,
    "name": "Aikido at UHM",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "To practice Aikido",
    "type": "Leisure/Recreational",
    "contactPerson": "Tim Halliday",
    "email": "halliday@hawaii.edu"
  },
  {
    "id": 5,
    "name": "Alpha Gamma Delta Delta Sigma",
    "dateApproved": "11/7/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of Alpha Gamma Delta Delta Sigma is to offer women the opportunity to have sisterly connections with other University of Hawaii students whom value being loving, leading, and lasting. We have weekly meetings to connect with each other and develop ourselves professionally. We live by the ",
    "type": "Fraternity/Sorority",
    "contactPerson": "Gabriela Robles",
    "email": "grobles@hawaii.edu"
  },
  {
    "id": 6,
    "name": "Alpha Omega Hawaii",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "A.The primary function of Alpha Omega Hawaii will be to provide students with the opportunity for spiritual growth by interacting with other students who are Christians at UH B. To encourage academic excellence C. Alpha Omega Hawaii aims to encourage members to uphold the standards held and establis",
    "type": "Religious/Spiritual",
    "contactPerson": "Jennifer Moya",
    "email": "jdmoya@hawaii.edu"
  },
  {
    "id": 7,
    "name": "American Institute for Aeronautics and Astronautics Student Branch at the University of Hawai'i at Manoa",
    "dateApproved": "10/23/25",
    "expirationDate": "9/30/26",
    "purpose": "Establish a community for aerospace-related student projects and programs at the UHM and further the purposes and programs of AIAA.",
    "type": "Academic/Professional",
    "contactPerson": "Kenoi Salvador",
    "email": "kenoisal@hawaii.edu"
  },
  {
    "id": 8,
    "name": "American Institute of Architecture Students Hawai'i Chapter",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "The American Institute of Architecture Students (AIAS) is an independent, nonprofit, student-run organization dedicated to providing unmatched progressive programs, information, and resources on issues critical to architecture and the experience of education. The AIAS aims to promote excellence in a",
    "type": "Academic/Professional",
    "contactPerson": "Tiana Mangrobang",
    "email": "tncm@hawaii.edu"
  },
  {
    "id": 9,
    "name": "American Library Association Student Chapter (ALAsc)",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "The American Library Association Student Chapter at the University of Hawai‘i at Mānoa, Library and Information Science Program, exists to foster professional engagement, leadership, and community among students preparing for careers in librarianship and information science. The organization encoura",
    "type": "Academic/Professional",
    "contactPerson": "Camille Dahmen",
    "email": "cdahmen@hawaii.edu"
  },
  {
    "id": 10,
    "name": "American Marketing Association",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "The mission of the American Marketing Association centers on creating an inclusive and dynamic community where members can deepen their understanding of the ever-evolving marketing landscape and confidently transition into the professional world. We welcome students from all academic disciplines who",
    "type": "Academic/Professional",
    "contactPerson": "Michelle Tanabe",
    "email": "rmtanabe@hawaii.edu"
  },
  {
    "id": 11,
    "name": "American Society of Civil Engineers",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "The American Society of Civil Engineers (ASCE) student chapter at the University of Hawaii at Manoa is a proud organization geared towards promoting the civil engineering profession and providing a better understanding of the field outside of the classroom. The mission of the University of Hawai'i a",
    "type": "Academic/Professional",
    "contactPerson": "Amier Ishaque",
    "email": "aishaque@hawaii.edu"
  },
  {
    "id": 12,
    "name": "American Society of Heating, Refrigerating and Air-Conditioning Engineers",
    "dateApproved": "10/23/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization is to provide opportunities to mechanical engineering students interested in pursuing a career in HVAC. ASHRAE promotes professional development through informative and networking events.",
    "type": "Academic/Professional",
    "contactPerson": "Micah Shibuya",
    "email": "shibuya4@hawaii.edu"
  },
  {
    "id": 13,
    "name": "American Society of Mechanical Engineers",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "The American Society of Mechanical Engineers (ASME) at the University of Hawaii - Manoa is an organization dedicated to providing services to the UHM College of Engineering (COE) Mechanical Engineering which include: Professional Development and Networking Being a conduit between the COE and the Mec",
    "type": "Academic/Professional",
    "contactPerson": "Landon Imamura",
    "email": "landonki@hawaii.edu"
  },
  {
    "id": 14,
    "name": "Animal Science Club at UH Manoa",
    "dateApproved": "10/28/25",
    "expirationDate": "9/30/26",
    "purpose": "The Animal Science Club at the University of Hawaii at Manoa is committed to students who share an interest and passion for animals and livestock production systems. The club accomplishes its mission by organizing events that emphasize education and hands-on experience. The club also participates in",
    "type": "Academic/Professional",
    "contactPerson": "Abigail Ana",
    "email": "aheana@hawaii.edu"
  },
  {
    "id": 15,
    "name": "Aquaholics Scuba Club",
    "dateApproved": "10/23/25",
    "expirationDate": "9/30/26",
    "purpose": "Create a community of scuba divers and lovers of the Ocean. Give students more opportunities to dive and help raise awareness of oceanic threats and conservation through volunteer work, education, and fun.",
    "type": "Leisure/Recreational",
    "contactPerson": "Megan Mcferson",
    "email": "mcferson@hawaii.edu"
  },
  {
    "id": 16,
    "name": "Associated Students of the John A. Burns School of Medicine",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of ASJABSOM and the JABSOM Classes is to serve as the official body representing the medical students of JABSOM. To that end, purposes include, but are not limited to advocating on behalf of the medical students of JABSOM, promoting the welfare of JABSOM and its students, and fostering s",
    "type": "Academic/Professional",
    "contactPerson": "Kai Hirayama",
    "email": "kaihira@hawaii.edu"
  },
  {
    "id": 17,
    "name": "Association for Educational Communications and Technology - Hawaii (AECT-HI)",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The AECT-HI Chapter is organized to provide a campus-based focal point for individuals interested in using technology in training and education in association with the University of Hawaii at Manoa Department of Learning Design and Technology (LTEC). The purpose of the Chapter is to provide professi",
    "type": "Academic/Professional",
    "contactPerson": "Audrey Villanueva",
    "email": "audreyv@hawaii.edu"
  },
  {
    "id": 18,
    "name": "Ballroom Dance Club @UH",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "Promote social and competitive ballroom dance within the UH community",
    "type": "Leisure/Recreational",
    "contactPerson": "Ravi Narayan",
    "email": "rnarayan@hawaii.edu"
  },
  {
    "id": 19,
    "name": "Baptist Collegiate Ministries O'ahu",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "BCM O‘AHU exists to engage college students with the Gospel, develop disciples of Jesus Christ, and mobilize servant leaders for the Church in order to reach the world. We strive to partner with local churches to advance God’s kingdom on every college campus in Hawai‘i and the regions inside of Hawa",
    "type": "Religious/Spiritual",
    "contactPerson": "Tomas Ochoa",
    "email": "tochoa7@hawaii.edu"
  },
  {
    "id": 20,
    "name": "Belly Dance RaQs",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "Belly Dance RaQs was created to give students within the University of Hawai’i system an opportunity to learn about belly dance in a fun and safe environment. Belly dance is not only a great way to relieve stress, but provides a light to medium impact workout. Thus, the organization aims to improve ",
    "type": "Leisure/Recreational",
    "contactPerson": "India Ching",
    "email": "ikcc@hawaii.edu"
  },
  {
    "id": 21,
    "name": "Best Buddies Chapter at UHM",
    "dateApproved": "12/22/25",
    "expirationDate": "9/30/26",
    "purpose": "The Best Buddies chapter at UHM is dedicated to enhancing the lives of people with intellectual and developmental disabilities (IDD) through the power of friendship and inclusion. Our mission is to foster meaningful one-to-one friendships between college students and individuals with IDD, promoting ",
    "type": "Academic/Professional",
    "contactPerson": "Robin Dazzeo",
    "email": "rdazzeo@hawaii.edu"
  },
  {
    "id": 22,
    "name": "Beta Alpha Psi - Delta Theta Chapter",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "Our purpose is to develop our members into becoming driven and successful students and accounting professionals by providing them with unique resources and opportunities during their time in college",
    "type": "Academic/Professional",
    "contactPerson": "Kaitlyn Hasegawa",
    "email": "kmh22@hawaii.edu"
  },
  {
    "id": 23,
    "name": "Beta Beta Gamma Sorority",
    "dateApproved": "10/23/25",
    "expirationDate": "9/30/26",
    "purpose": "Fostering a supportive and inclusive environment that promotes personal growth, leadership development, academic excellence, and service to the community. Creating a welcoming environment where members can cultivate lifelong friendships, celebrate diversity, and make meaningful contributions to soci",
    "type": "Fraternity/Sorority",
    "contactPerson": "Dakota Bow",
    "email": "dbow@hawaii.edu"
  },
  {
    "id": 24,
    "name": "Black Law Students Association",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The mission of the Black Law Students Association (BLSA) at the William S. Richardson School of Law is to promote, inspire, and empower Black students and Allies to achieve excellence in academics, career progression, personal development, and community engagement. We are committed to exemplifying i",
    "type": "Ethnic/Cultural",
    "contactPerson": "Hannah Hawley",
    "email": "hehawley@hawaii.edu"
  },
  {
    "id": 25,
    "name": "Black Student Association",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "The Black Student Association (BSA) was established in 2016 in response to the lack of representation for Black students, faculty, and staff at the University of Hawaiʻi at Mānoa (UHM). The goals of the student-led organization are to: increase awareness and understanding of African American issues,",
    "type": "Ethnic/Cultural",
    "contactPerson": "Niya McAdoo",
    "email": "nmcadoo@hawaii.edu"
  },
  {
    "id": 26,
    "name": "Business Executive Society of Tomorrow",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "The Business Executive Society of Tomorrow is a general business club at the University of Hawaii at Manoa’s Shidler College of Business. Founded by students in 1998, BEST has a proud history of maintaining and perpetuating excellence in its members. Through the years, we have developed a culture of",
    "type": "Honorary Society",
    "contactPerson": "Alan Ichinose",
    "email": "ari2022@hawaii.edu"
  },
  {
    "id": 27,
    "name": "Business of Medicine Interest Group",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The Business of Medicine Interest Group at JABSOM aims to educate medical students on the economic and organizational aspects of healthcare to promote success and competency in Hawaii's future physicians.",
    "type": "Academic/Professional",
    "contactPerson": "Chloe McCreery",
    "email": "chloemcc@hawaii.edu"
  },
  {
    "id": 28,
    "name": "C.O.P. Alakaʻina Club",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "Our purpose is to promote college success and post-secondary opportunities for our College Opportunities Program (COP) students. COP Alaka'ina serves our COP freshmen and alumni throughout the academic year by providing guidance, information, and workshops about academic and college life at UH Manoa",
    "type": "Academic/Professional",
    "contactPerson": "Kawaianuhea Moss",
    "email": "kmoss@hawaii.edu"
  },
  {
    "id": 29,
    "name": "Cafe Hoppers",
    "dateApproved": "10/28/25",
    "expirationDate": "9/30/26",
    "purpose": "Our club is formed for students to relax, chill during our busy school semesters. Targeted for students to socialize and make new connections through weekly coffee and cafe events, including occasional coffee making lessons and themed pop-up events. We also explore and engage with small businesses o",
    "type": "Leisure/Recreational",
    "contactPerson": "Jade Zhang",
    "email": "zhangj2@hawaii.edu"
  },
  {
    "id": 30,
    "name": "Campus Chinese Christian Ministry",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose is to offer a welcoming space for students and scholars at the University of Hawaii to ﬁnd support, companionship, and spiritual fulﬁllment. Our focus is not only on academic and professional excellence but also on understanding the deeper meaning of life through family, kinship, love, a",
    "type": "Religious/Spiritual",
    "contactPerson": "Sen Zhao",
    "email": "zhaos@hawaii.edu"
  },
  {
    "id": 31,
    "name": "CARP Hawai'i",
    "dateApproved": "10/28/25",
    "expirationDate": "9/30/26",
    "purpose": "CARPs’ purpose is to help every student practice life principles essential for personal fulfillment and leadership skills with which to make a positive difference in society. To inspire and empower students by fostering beliefs in God and principles of life, and its application in furthering the cau",
    "type": "Religious/Spiritual",
    "contactPerson": "Rena Saito",
    "email": "saito22@hawaii.edu"
  },
  {
    "id": 32,
    "name": "CHAARG at University of Hawaii at Manoa",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "To enhance our members’ knowledge and experience of health, fitness, and overall wellness through providing opportunities for our members to engage in various forms of healthy activities; To advocate for and seek to address issues of concern for members and women in general; To serve as a network fo",
    "type": "Leisure/Recreational",
    "contactPerson": "Isabel Dalsimer",
    "email": "isabeld@hawaii.edu"
  },
  {
    "id": 33,
    "name": "Chess Club at UH Manoa",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "We want to grow the game of Chess and provide a place for people to learn, enjoy chess, and socialize with other like-minded students.",
    "type": "Leisure/Recreational",
    "contactPerson": "Bobby Lyon",
    "email": "lyon42@hawaii.edu"
  },
  {
    "id": 34,
    "name": "Chi Alpha Hawaii",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "We disciple university students to fulfill their purpose in God's global plan. Our mission is to reconcile students to Christ, equipping them through Spirit-Filled communities of prayer, worship, fellowship, discipleship, and mission to transform the university, the marketplace and the world.",
    "type": "Religious/Spiritual",
    "contactPerson": "Destiny Yasuhara",
    "email": "destinyy@hawaii.edu"
  },
  {
    "id": 35,
    "name": "Chi Epsilon",
    "dateApproved": "10/10/25",
    "expirationDate": "9/30/26",
    "purpose": "Chi Epsilon is the Hawaii chapter of the larger national Chi Epsilon Civil Engineering Honor Society. It was organized to recognize the characteristics of the individual civil engineer deemed to be fundamental to the successful pursuit of an engineering career, and to aid in the development of those",
    "type": "Honorary Society",
    "contactPerson": "Dawn Nakamaru",
    "email": "dawnk@hawaii.edu"
  },
  {
    "id": 36,
    "name": "Chinese Club",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "The Chinese Club seeks to create a community where students of all majors and backgrounds can learn, appreciate, and celebrate various aspects of Chinese culture and language. The Chinese Club aims to create an inclusive environment for students to immerse themselves in Chinese culture and build mea",
    "type": "Ethnic/Cultural",
    "contactPerson": "Katherine Kaw",
    "email": "kkaw@hawaii.edu"
  },
  {
    "id": 37,
    "name": "Church in Honolulu",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization is to bring together followers of Christ at UH Mānoa to grow in faith, fellowship, and service. We seek to encourage spiritual growth through prayer, study, and worship, while fostering unity as one body in Christ and sharing His love within the campus and greater Ho",
    "type": "Religious/Spiritual",
    "contactPerson": "Xinghui Li",
    "email": "Xli7@hawaii.edu"
  },
  {
    "id": 38,
    "name": "Class of 2026 at JABSOM",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "1. Serve as liaisons between the larger student body and JABSOM faculty (e.g. Office of Medical Education and Office of Student Affairs). 2. Consult, deliberate, and make decisions for student-led events held at the John A. Burns School of Medicine (referred to as JABSOM from here on). 3. Fundraise ",
    "type": "Academic/Professional",
    "contactPerson": "D-Dré Wright",
    "email": "ddre@hawaii.edu"
  },
  {
    "id": 39,
    "name": "Class of 2027 at JABSOM",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization is to gather a group of students to: (1) serve as liaisons between the larger student body and JABSOM faculty (e.g. Office of Medical Education and Office of Student Affairs); (2) consult, deliberate, and make decisions for student-led events held at JABSOM; and (3) ",
    "type": "Academic/Professional",
    "contactPerson": "Jenny Nguyen",
    "email": "nj23@hawaii.edu"
  },
  {
    "id": 40,
    "name": "Class of 2028 at JABSOM",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "Serve as liaisons between the larger student body and JABSOM faculty (e.g. Office of Medical Education and Office of Student Affairs). Consult, deliberate, and make decisions for student-led events held at the John A. Burns School of Medicine (referred to as JABSOM from here on). Fundraise and dispe",
    "type": "Academic/Professional",
    "contactPerson": "Kai Hirayama",
    "email": "kaihira@hawaii.edu"
  },
  {
    "id": 41,
    "name": "Club Management Association of America",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "The objectives of the Association are to promote relationships between club management professionals and other similar professions; to encourage the education and advancement of members; and to provide the resources needed for efficient and successful club operations. Under the covenants of professi",
    "type": "Academic/Professional",
    "contactPerson": "Taylor Morikawa",
    "email": "tkmorika@hawaii.edu"
  },
  {
    "id": 42,
    "name": "College Democrats at the University of Hawaii at Mānoa",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the College Democrats is to organize students and faculty at the University of Hawaiʻi at Mānoa who are passionate about progressive politics, to civically educate students with the aim of making politics accessible for all, engage in our community, help elect Democratic candidates, a",
    "type": "Political",
    "contactPerson": "Amelia Sofos",
    "email": "asofos@hawaii.edu"
  },
  {
    "id": 43,
    "name": "CRU",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "A caring community that seeks to love God and love others. The purpose of the movement, as articulated in the Charter, is to build movements of people who are transformed by Jesus Christ. The student-led movement seeks to introduce students to Jesus Christ, help them to grow in their faith, encourag",
    "type": "Religious/Spiritual",
    "contactPerson": "Sara Ireland",
    "email": "sni812@hawaii.edu"
  },
  {
    "id": 44,
    "name": "Debate Team at the University of Hawai’i at Manoa",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the Debate Team is to promote intellectual curiosity and foster a vibrant community of discussion among students from diverse majors. The team provides a platform for courteous and thoughtful public speaking, research, advocacy, and leadership development, encouraging members to engag",
    "type": "Academic/Professional",
    "contactPerson": "Carol Maxcy",
    "email": "maxcycr@hawaii.edu"
  },
  {
    "id": 45,
    "name": "Delta Sigma Pi: Rho Chi",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "Delta Sigma Pi is a professional fraternity organized to foster the study of business in universities; to encourage scholarship, social activity and the association of students for their mutual advancement by research and practice; to promote closer affiliation between the commercial world and stude",
    "type": "Honorary Society",
    "contactPerson": "Jacie Sakaino",
    "email": "jacies8@hawaii.edu"
  },
  {
    "id": 46,
    "name": "Domestic Violence Awareness Committee",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "Spread awareness about domestic violence and its impact on the health and wellness of our community. In addition, equip our members with knowledge to be able to recognize warning signs that may identify survivors of domestic violence by educating the members of our community",
    "type": "Service",
    "contactPerson": "Michael Ajimura",
    "email": "ajimuram@hawaii.edu"
  },
  {
    "id": 47,
    "name": "Drone Technologies at the University of Hawaii at Manoa",
    "dateApproved": "12/22/25",
    "expirationDate": "9/30/26",
    "purpose": "This VIP course focuses on designing, building, and testing unmanned aerial systems (drones). Students create lightweight, power-efficient drones with autonomous navigation and advanced image processing. Applications include identifying above-ground unexploded ordnance (UXOs), demonstrating safe ret",
    "type": "Academic/Professional",
    "contactPerson": "Sammie Lin",
    "email": "linsammi@hawaii.edu"
  },
  {
    "id": 48,
    "name": "Dungeons and Tables at Manoa",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "This club provides a social and fun extracurricular activity where UHM students may participate in old school table top role playing games. (Ex. Dungeons and Dragons, warhammer, fallout) Dungeons and Tables at Manoa also provides the experience of meeting new students with similar interests from all",
    "type": "Leisure/Recreational",
    "contactPerson": "Jason Solano Jr",
    "email": "solanoj@hawaii.edu"
  },
  {
    "id": 49,
    "name": "East-West Toastmasters",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "To provide a mutually supportive and positive learning environment in which every member has the opportunity to develop communication and leadership skills, which in turn foster self-confidence and personal growth",
    "type": "Academic/Professional",
    "contactPerson": "Fernando Santiago-Mandujano",
    "email": "santiago@hawaii.edu"
  },
  {
    "id": 50,
    "name": "Emergency Medicine Interest Group",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "It is the purpose of EMIG to provide a forum for medical students to foster their interest in the Emergency Medicine specialty, to serve as the base for hands-on activities and research opportunities pertaining to EMIG, and to provide guidance for students interested in applying for Emergency Medici",
    "type": "Academic/Professional",
    "contactPerson": "Jackson Underhill",
    "email": "junderhi@hawaii.edu"
  },
  {
    "id": 51,
    "name": "Engineers' Council at the University of Hawai'i",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the Engineering Council of the University of Hawaii is to - represent the engineering student body; - support engineering organizations in reaching their full potential; - and promote a diverse community through successful collaboration between students, faculty, organizations, and th",
    "type": "Academic/Professional",
    "contactPerson": "Tiffany Rose, Mendoza",
    "email": "trcmendo@hawaii.edu"
  },
  {
    "id": 52,
    "name": "English Majors Association",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization shall be to promote interaction amongst the students and faculty within the English Department, create an active literary community, and increase participation in both on-campus and off-campus English related events and activities. The purpose will also be to support",
    "type": "Academic/Professional",
    "contactPerson": "Samantha Avila Gomez",
    "email": "sag9@hawaii.edu"
  },
  {
    "id": 53,
    "name": "Environmental Justice Club",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "\"The Environmental Justice Club seeks to encourage student engagement in current environmental and social affairs and promote environmental justice. The Club also aims to create a social space for students who have interests and curiosity about the issues related to local, national, and global envir",
    "type": "Academic/Professional",
    "contactPerson": "Gabrielle Kics",
    "email": "gkics@hawaii.edu"
  },
  {
    "id": 54,
    "name": "Environmental Law Society",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "The University of Hawai`i at Mānoa William S. Richardson School of Lawʻs Environmental Law Society (“ELS”) provides students and the community with exposure to environmental issues and laws, participates in conservation efforts, and develops students' skills to participate in the making of sound env",
    "type": "Academic/Professional",
    "contactPerson": "Kayla Bartolini",
    "email": "kaylasb@hawaii.edu"
  },
  {
    "id": 55,
    "name": "Eta Kappa Nu",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "Eta Kappa Nu (HKN) is the international Honor Society for Electrical & Computer Engineers. We induct members who have demonstrated exceptional academic and professional excellence, while fostering a commitment to service through volunteering and community projects. HKN also serves to connect our mem",
    "type": "Honorary Society",
    "contactPerson": "Alexander Chang",
    "email": "atyc@hawaii.edu"
  },
  {
    "id": 56,
    "name": "Eta Sigma Delta",
    "dateApproved": "10/24/25",
    "expirationDate": "9/30/26",
    "purpose": "Eta Sigma Delta is an international honor society that recognizes the scholastic and professional achievements of students and alumni from institutions granting diplomas, associate and baccalaureate degrees, or their equivalents, in the field of hospitality, tourism, and culinary arts.",
    "type": "Honorary Society",
    "contactPerson": "Kana Wang",
    "email": "kanaw@hawaii.edu"
  },
  {
    "id": 57,
    "name": "Every Nation Honolulu",
    "dateApproved": "10/23/25",
    "expirationDate": "9/30/26",
    "purpose": "We aim to invite students and young adults into a Christ-centered community that spans over 80+ nations.",
    "type": "Religious/Spiritual",
    "contactPerson": "Kaisho Collins",
    "email": "kaishoc@hawaii.edu"
  },
  {
    "id": 58,
    "name": "Family Medicine Interest Group",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of FMIG is to increase interest in Family Medicine and address Hawaii’s primary care deficit, provide professional development through networking opportunities with Family Medicine physicians, and increase community outreach to Hawaii’s underserved and vulnerable populations.",
    "type": "Academic/Professional",
    "contactPerson": "Lindney Acosta",
    "email": "lindneya@hawaii.edu"
  },
  {
    "id": 59,
    "name": "Federal Bar Association - Hawaiʻi Student Chapter",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "The mission of the FBA Hawai‘i Student Chapter is to support the interests and needs of Richardson law students aspiring to Federal practice, both public and private, as well as to strengthen student interest and knowledge of the Federal legal system. The Hawaii Student Division, like other law scho",
    "type": "Academic/Professional",
    "contactPerson": "Kai Okazaki",
    "email": "kaio73@hawaii.edu"
  },
  {
    "id": 60,
    "name": "Filipino Law Students Association",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "To foster a strong community in support of legal issues surrounding the Filipino community here at the William S. Richardson School of Law. We also want to forge strong relationships with active community leaders that support our cause.",
    "type": "Academic/Professional",
    "contactPerson": "Mindnay Nisa Gapet",
    "email": "mngapet@hawaii.edu"
  },
  {
    "id": 61,
    "name": "Financial Management Association",
    "dateApproved": "10/23/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the Financial Management Association is to further the professional and personal development of Hawaiis next generation of finance professionals and leaders.",
    "type": "Academic/Professional",
    "contactPerson": "Chanel Higa",
    "email": "chanelhi@hawaii.edu"
  },
  {
    "id": 62,
    "name": "Freshmen Mentorship Program",
    "dateApproved": "12/22/25",
    "expirationDate": "9/30/26",
    "purpose": "To connect incoming freshmen and upperclassmen in order to support TIM students in their personal and professional development and to build connections with peers, alumni, and the local travel industry.",
    "type": "Academic/Professional",
    "contactPerson": "Cody-John Sakamoto",
    "email": "cody30@hawaii.edu"
  },
  {
    "id": 63,
    "name": "Global Health Interest Group",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization shall be to provide resources and support for students interested in global health initiatives. We will coordinate meetings and events to make global health more accessible to students.",
    "type": "Academic/Professional",
    "contactPerson": "Chloe McCreery",
    "email": "chloemcc@hawaii.edu"
  },
  {
    "id": 64,
    "name": "Go Club at the University of Hawaii",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The Go Club at the University of Hawaii aims to promote the Game of Go. By providing a platform for players of all skill levels, the club encourages collaboration, friendly competition, and the exploration of Go’s rich history and techniques.",
    "type": "Leisure/Recreational",
    "contactPerson": "Chloe McCreery",
    "email": "chloemcc@hawaii.edu"
  },
  {
    "id": 65,
    "name": "Gold Humanism Honor Society",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The John A. Burns School of Medicine (JABSOM) endeavors to facilitate the growth of competent, compassionate, culturally sensitive, and socially responsible physicians. The strengthening of personal attributes such as integrity, compassion, altruism, respect, excellence, and empathy is essential to ",
    "type": "Academic/Professional",
    "contactPerson": "D-Dré Wright",
    "email": "ddre@hawaii.edu"
  },
  {
    "id": 66,
    "name": "Graduate Student Sociological Association",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "The GSSA provides a safe space for graduate students to present the ideas, interests, and concerns of the members of the student body and serves as a liaison between the students, faculty, and administration. The GSSA facilitates communication and involvement among students through scheduled meeting",
    "type": "Academic/Professional",
    "contactPerson": "Matthieu Kalua",
    "email": "mkalua4@hawaii.edu"
  },
  {
    "id": 67,
    "name": "Graduate Women in Science Hawaii",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "Our mission is to support and honor the past, present, and future women scientists of Hawai‘i and the Pacific Region. We aim to unite all scientific disciplines and diverse backgrounds in celebrating women, girls, non-binary and gender non-conforming folks in their personal and professional endeavor",
    "type": "Academic/Professional",
    "contactPerson": "Linnea Wolniewicz",
    "email": "linneamw@hawaii.edu"
  },
  {
    "id": 68,
    "name": "Hawai'i Branch of the American Society of Microbiology Student Chapter",
    "dateApproved": "10/23/25",
    "expirationDate": "9/30/26",
    "purpose": "The Society’s mission is to promote and advance the microbial sciences. ASM is a global scientific society whose goals are to shape the future of the microbial sciences, connect microbial sciences stakeholders worldwide, and ensure appropriate societal impact of the microbial sciences. ASM is commit",
    "type": "Academic/Professional",
    "contactPerson": "Brianna Correa",
    "email": "correabr@hawaii.edu"
  },
  {
    "id": 69,
    "name": "Hawaii Pickleball Club at The University of Hawaii at Manoa",
    "dateApproved": "10/23/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the Hawaiʻi Pickleball Club is to provide students with regular open play sessions where they can decompress from school, socialize, and build new connections through the sport of pickleball. Our club offers a fun and welcoming environment for all skill levels, giving students a chanc",
    "type": "Leisure/Recreational",
    "contactPerson": "Conner Koga",
    "email": "cmk26@hawaii.edu"
  },
  {
    "id": 70,
    "name": "Hawaii Powerlifting Club",
    "dateApproved": "10/23/25",
    "expirationDate": "9/30/26",
    "purpose": "The mission of the organization is to support the University of Hawai'i community by providing an engaging, encouraging, and safe environment for members. The purpose of forming the organization is to create a team that can represent the University at local, state, and national competitions.",
    "type": "Leisure/Recreational",
    "contactPerson": "Hunter Von Tungeln",
    "email": "hvt7@hawaii.edu"
  },
  {
    "id": 71,
    "name": "Hawaii Sigma Pi",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "In order to establish a closer bond of fellowship which will result in mutual benefit to those men and women in the study and in the profession of mechanical engineering, who by their academic or practical achievements, manifest a real interest and marked ability in their chosen work, this constitut",
    "type": "Honorary Society",
    "contactPerson": "Matthew Fujioka",
    "email": "mt66@hawaii.edu"
  },
  {
    "id": 72,
    "name": "Hawaii Student Entrepreneurs Club",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "Inspire and grow students’ entrepreneurial mindset. All of our members will learn how to start a business, meet established entrepreneurs, and learn about various entrepreneurial topics.",
    "type": "Academic/Professional",
    "contactPerson": "Jazmyne Faith Viloria",
    "email": "jazmynef@hawaii.edu"
  },
  {
    "id": 73,
    "name": "Hawaii Undergraduate Initiative",
    "dateApproved": "10/23/25",
    "expirationDate": "9/30/26",
    "purpose": "HUI RIO strives to build a community and support system for current Hawai'i Undergraduate Initiative students, alumni, and friends by providing resources, academic services, social, and community activities needed to ensure that students continue to have a college going attitude.",
    "type": "Academic/Professional",
    "contactPerson": "Taryn Tyau",
    "email": "tarynlt@hawaii.edu"
  },
  {
    "id": 74,
    "name": "Hillel Hawai'i",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "\" Enrich the lives of Jewish students—both undergraduate and graduate—within the University of Hawaiʻi system and beyond, through intellectual, spiritual, cultural, and social engagement; Foster an inclusive and pluralistic community supporting tzedek (social justice), tikkun olam (repairing the wor",
    "type": "Religious/Spiritual",
    "contactPerson": "Shai Michael Zaid",
    "email": "shaiz@hawaii.edu"
  },
  {
    "id": 75,
    "name": "HONU Scientists",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization is to provide a supportive hui to promote opportunities for the development of nurse scientists among students and faculty at UHM and the larger nursing professional community. Specific activities and functions of the organization will include mentoring, professional",
    "type": "Academic/Professional",
    "contactPerson": "Samia Valeria Ozorio Dutra",
    "email": "samiaval@hawaii.edu"
  },
  {
    "id": 76,
    "name": "HOSA at UH Mānoa",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "Establishing and reviving the HOSA - Future Health Professionals chapter at UH Mānoa. Providing pre-health related opportunities to members of the chapter, such as shadowing, volunteering, and skill-based workshops. Additionally coaching and assisting peers for competing in HOSA - FHP health competi",
    "type": "Academic/Professional",
    "contactPerson": "Joshua Bryn Ramo",
    "email": "jramo@hawaii.edu"
  },
  {
    "id": 77,
    "name": "Hui Dui",
    "dateApproved": "10/23/25",
    "expirationDate": "9/30/26",
    "purpose": "All registered Library and Information Science (LIS) graduate students are part of Hui Dui, the student organization of LIS. Hui Dui represents students at LIS faculty and committee meetings, and collaborates with other student organizations to advocate for LIS students at local professional organiz",
    "type": "Academic/Professional",
    "contactPerson": "Allyson Taylor",
    "email": "ajt6@hawaii.edu"
  },
  {
    "id": 78,
    "name": "Information Technology Management Association",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "To foster among students a better understanding of the vital business role of information technology, the proper relationship of information technology to management, and the necessity for a professional attitude among information technology professionals in their approach to an understanding and ap",
    "type": "Academic/Professional",
    "contactPerson": "Dylan Chen",
    "email": "dylanche@hawaii.edu"
  },
  {
    "id": 79,
    "name": "Inspire Church YA",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of Inspire Church YA is to provide a Christ-centered community where students can grow in their faith, build authentic relationships, and live out their calling as followers of Jesus. We exist to inspire, equip, and send young adults to impact their campus, families, and communities with",
    "type": "Religious/Spiritual",
    "contactPerson": "Irie Gray",
    "email": "iriegray@hawaii.edu"
  },
  {
    "id": 80,
    "name": "Institute of Electrical and Electronics Engineers (IEEE)",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "We aim to encourage students to engage with the electrical and computer engineering community at the University of Hawaii at Manoa. The IEEE Student Branch wants to promote students’ academic and professional success. We are open to all majors and do not require members to pay any fees or dues.",
    "type": "Academic/Professional",
    "contactPerson": "Stephanie Chu",
    "email": "shchu@hawaii.edu"
  },
  {
    "id": 81,
    "name": "Inter-Business Council",
    "dateApproved": "10/28/25",
    "expirationDate": "9/30/26",
    "purpose": "We, the represented registered independent business organizations of the Shidler College of Business (SCB), Inter-Business Council (IBC) as it stands: in order to better serve and be responsive to the needs of the recognized undergraduate population; to serve as liaison between the SCB undergraduate",
    "type": "Academic/Professional",
    "contactPerson": "Marisa Van Duyne",
    "email": "marisa22@hawaii.edu"
  },
  {
    "id": 82,
    "name": "International Business Organization",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The International Business Organization (IBO) champions global awareness and professional growth through professional development events, global analysis workshops, study abroad aid, and more. By aligning with the Shidler College of Business’s mission of International Excellence, IBO cultivates a co",
    "type": "Academic/Professional",
    "contactPerson": "Noah Kessler",
    "email": "kesslern@hawaii.edu"
  },
  {
    "id": 83,
    "name": "International Student Association (ISA)",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the International Student Association (ISA) is: To promote global friendship and understanding; To support new and continuing students in their educational objectives; To explore issues and places in Hawaii; To develop leadership among students; To have fun.",
    "type": "Academic/Professional",
    "contactPerson": "Joann Lin",
    "email": "joannlin@hawaii.edu"
  },
  {
    "id": 84,
    "name": "Intervarsity Christian Fellowship/USA",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "Transformed by God's Aloha, together we bless the campus, the islands, and the nation.",
    "type": "Religious/Spiritual",
    "contactPerson": "Mark Brehm",
    "email": "mbrehm@hawaii.edu"
  },
  {
    "id": 85,
    "name": "JABSOM c/o 2029 Class Council",
    "dateApproved": "10/23/25",
    "expirationDate": "9/30/26",
    "purpose": "Our purpose is to serve as a unified voice for the JABSOM Class of 2029, fostering a strong sense of community and ensuring our collective well-being throughout our medical school journey. As the Class Council, we do this by acting as the primary liaison between our classmates and JABSOM's administr",
    "type": "Academic/Professional",
    "contactPerson": "Caitlin Tanji",
    "email": "ctanji@hawaii.edu"
  },
  {
    "id": 86,
    "name": "JABSOM OB/GYN Interest Group",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "It is the purpose of OB/GYN IG is to provide a forum for medical students to foster their extra-curricular interest in the obstetrics and gynecology (OB/GYN) specialty, to serve as the base for hands-on activities and research opportunities pertaining to OB/GYN, and to provide guidance for students ",
    "type": "Academic/Professional",
    "contactPerson": "Alexandra Masca",
    "email": "amasca@hawaii.edu"
  },
  {
    "id": 87,
    "name": "Japanese Culture Club at UH Manoa",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "To create a safe space for people to enjoy the Japanese culture and make new friends.",
    "type": "Ethnic/Cultural",
    "contactPerson": "Leilah Eusebio",
    "email": "leilahve@hawaii.edu"
  },
  {
    "id": 88,
    "name": "Jehovah's Witnesses",
    "dateApproved": "10/24/25",
    "expirationDate": "9/30/26",
    "purpose": "Event Title: Bible based discussions with free Bible based literature will be available to the public. Two two-wheeled carts will offer the literature. Each cart is approx. 3 feet wide by 5ft high. One cart will have literature printed in the English language and the other cart will have literature ",
    "type": "Religious/Spiritual",
    "contactPerson": "Roberta Baird",
    "email": "Bairdr@hawaii.edu"
  },
  {
    "id": 89,
    "name": "Judo Team/Club at University of Hawaii at Manoa",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "- To provide opportunity to practice judo, a lifelong physical and mental education system. -To develop excellent moral character and promote the spirit of social entrepreneurship to serve community. - To offer leadership development opportunities to members through club and team organizational mana",
    "type": "Leisure/Recreational",
    "contactPerson": "Dayven Hom",
    "email": "dhom23@hawaii.edu"
  },
  {
    "id": 90,
    "name": "K-pop Cardio Crew",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The K-Pop Cardio Crew strives to promote fitness and spread appreciation for pop music of all languages. Our purpose is to create a supportive community for students who love K-Pop and dancing. We aim to expand knowledge of different cultures through exercise. The club’s mission is to make exercise ",
    "type": "Leisure/Recreational",
    "contactPerson": "Phoeberly Ungos",
    "email": "pungos@hawaii.edu"
  },
  {
    "id": 91,
    "name": "Ka Mea Kolo",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "The University of Hawaiʻi Ka Mea Kolo Entomology Club strives to share our understanding and enthusiasm for the earth’s most diverse creatures especially those that have made Hawaiʻi their home. Although we often think of insects that don’t belong in Hawaiʻi like ants and roaches, we are actually ho",
    "type": "Academic/Professional",
    "contactPerson": "Sarah Pennington",
    "email": "sarahkp@hawaii.edu"
  },
  {
    "id": 92,
    "name": "Kappa Sigma",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "The Omicron Zeta Chapter of the Kappa Sigma Fraternity strives to create an environment for young men to grow in their personal and professional lives in accordance with our four pillars; our standards of excellence include fellowship, leadership, scholarship, and service. We serve this purpose thro",
    "type": "Fraternity/Sorority",
    "contactPerson": "Andrew Miles",
    "email": "awmiles@hawaii.edu"
  },
  {
    "id": 93,
    "name": "Kilohana at the University of Hawaii American Choral Directors Association Student Chapter",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose is to promote excellence in the field of choral music and to support and encourage the activities of the University of Hawaiʻi at Mānoa Music Department. Choral ensembles include the Concert Choir and Chamber Singers. The purpose of this organization shall also promote and abide by the N",
    "type": "Academic/Professional",
    "contactPerson": "Alina Taniguchi",
    "email": "alinat@hawaii.edu"
  },
  {
    "id": 94,
    "name": "Kim's Tae kwon Do at UHM",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "To promote fitness, disciple, self-defense, self-esteem through Martial Arts at the University of Hawaii and the surrounding community.",
    "type": "Leisure/Recreational",
    "contactPerson": "Mason Nakadomari",
    "email": "nakadoma@hawaii.edu"
  },
  {
    "id": 95,
    "name": "La Alianza",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization is to support the William S. Richardson School of Law’s (hereinafter WSRSL) Latine/Hispanic/Caribbean (LHC) community and to advance equal participation and opportunity for LHC individuals and members of other minority groups at WSRSL and beyond.",
    "type": "Ethnic/Cultural",
    "contactPerson": "Steven Manso",
    "email": "mansos@hawaii.edu"
  },
  {
    "id": 96,
    "name": "Lambda Law Student Association of Hawaiʻi",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization is to support the William S. Richardson School of Law (hereinafter WSRSL) queer, lesbian, gay, bisexual, transgender, gender non-conforming, asexual, and intersex (hereinafter LGBTQIA+) community and to advance equal rights for LGBTQIA+ individuals at WSRSL and beyon",
    "type": "Academic/Professional",
    "contactPerson": "Isis Usborne",
    "email": "iu@hawaii.edu"
  },
  {
    "id": 97,
    "name": "Latinxs Unidxs",
    "dateApproved": "12/4/25",
    "expirationDate": "9/30/26",
    "purpose": "Latinos Unidos exist to 1. Embolden and Empower the Latino Community in University of Hawai’i 2. Assume the responsibility as a mouthpiece to voice the opinions and concerns of Latino students at UH Manoa. 3. Share and Inform UH about our cultures, experiences, and stories 4. Facilitate consistent e",
    "type": "Ethnic/Cultural",
    "contactPerson": "Juventino Gutierrez",
    "email": "jg360@hawaii.edu"
  },
  {
    "id": 98,
    "name": "Law Review at the University of Hawaiʻi",
    "dateApproved": "10/10/25",
    "expirationDate": "9/30/26",
    "purpose": "The University of Hawaiʻi Law Review at the William S. Richardson School of Law serves the local legal community by providing an elite academic forum for legal scholarship in Hawaiʻi and the Pacific, and contributes to the national discourse on emerging legal issues through the publication of compel",
    "type": "Academic/Professional",
    "contactPerson": "Gabriel Baugh",
    "email": "gbaugh@hawaii.edu"
  },
  {
    "id": 99,
    "name": "LIFE (Love Is For Everyone)",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "LIFE is a Christian club for students who are interested in having fellowship and fun. This club is committed to providing opportunities for all students to study the bible, get together and have fun while abiding by all established policies of the University. A variety of activities will be conduct",
    "type": "Religious/Spiritual",
    "contactPerson": "Samantha Pinera",
    "email": "sjpin89@hawaii.edu"
  },
  {
    "id": 100,
    "name": "Linguistic Society of Mānoa",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "The mission of LSM is to promote academic and social activity among the students, staff, and faculty of the University of Hawaiʻi at Mānoa who are interested in linguistics. We are dedicated to the promotion of linguistics, and to making the study of language and linguistics fun, social, inclusive, ",
    "type": "Academic/Professional",
    "contactPerson": "Hunter Procter",
    "email": "procter7@hawaii.edu"
  },
  {
    "id": 101,
    "name": "Living Stone Chinese Christian Fellowship",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of Living Stone Chinese Christian Fellowship is to provide a welcoming community for students at the University of Hawaiʻi who are interested in exploring the Christian faith and building fellowship within a culturally inclusive environment. Our mission is to support the spiritual growth",
    "type": "Religious/Spiritual",
    "contactPerson": "Quan Zhang",
    "email": "quanz@hawaii.edu"
  },
  {
    "id": 102,
    "name": "Lord of the Universe Society (LOTUS)",
    "dateApproved": "11/3/25",
    "expirationDate": "9/30/26",
    "purpose": "To coordinate the cultural events of Diwali and Holi for the community and school",
    "type": "Ethnic/Cultural",
    "contactPerson": "Venkataraman Balaraman",
    "email": "venkatar@hawaii.edu"
  },
  {
    "id": 103,
    "name": "Mānoa Scholars Club",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the Mānoa Scholars Club is to give students—both incoming and continuing New Warrior Scholars—the opportunity to represent the best and brightest at UH Mānoa both academically and in character. Students who have a stronger commitment to their university are more likely to retain and e",
    "type": "Academic/Professional",
    "contactPerson": "Trista Yamaguchi",
    "email": "tristay@hawaii.edu"
  },
  {
    "id": 104,
    "name": "Marine Technology Society O‘ahu Student Section",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "The Marine Technology Society (MTS) is an international, multidisciplinary society whose purpose is to promote awareness, understanding, advancement, and application of marine technology.",
    "type": "Academic/Professional",
    "contactPerson": "Tyler Inkley",
    "email": "inkley@hawaii.edu"
  },
  {
    "id": 105,
    "name": "Math Club at the University of Hawaii at Manoa",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "The Math Club at the University of Hawaiʻi at Mānoa is dedicated to fostering a vibrant community for students passionate about mathematics. We aim to create a space where members can explore and deepen their understanding of mathematical concepts, collaborate on problem-solving, and engage in stimu",
    "type": "Academic/Professional",
    "contactPerson": "Gillen Vale Jusi",
    "email": "gjusi@hawaii.edu"
  },
  {
    "id": 106,
    "name": "Medical Education Student Interest Group",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "It is the purpose of Medical Education Student Interest Group to provide a forum for medical students to foster their extra-curricular interest in medical education. Medical Education Student Interest Group shall provide support for those pursuing the Dean’s Certificate of Distinction in Medical Edu",
    "type": "Academic/Professional",
    "contactPerson": "Kristal Xie",
    "email": "kristalx@hawaii.edu"
  },
  {
    "id": 107,
    "name": "Medical Humanities Interest Group",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "The Medical Humanities Interest Group aims to create a space to explore concepts surrounding the health humanities and engage with medicine and healthcare using different perspectives than the one we primarily use in traditional pre-med and medical education. We hope to foster productive discussions",
    "type": "Academic/Professional",
    "contactPerson": "Kalpana Balaraman",
    "email": "kbalaram@hawaii.edu"
  },
  {
    "id": 108,
    "name": "Medical Student Pride Alliance",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the Medical Student Pride Alliance (MSPA) is to support sexual and gender minority (SGM) diversity efforts within JABSOM and the community by promoting education, safe spaces, awareness, and ongoing discussion of SGM health.",
    "type": "Academic/Professional",
    "contactPerson": "Kasen Wong",
    "email": "kasentks@hawaii.edu"
  },
  {
    "id": 109,
    "name": "Midshipman Association",
    "dateApproved": "10/15/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the organization shall be to provide a community for Midshipman of Naval Reserve Officer Training Corps at the University of Hawai’i at Manoa (UH NROTC), as well as a community of supporters to the Midshipman. The group shall be focused on providing a service foundation to the communi",
    "type": "Service",
    "contactPerson": "Tiana Dayrit-Fuimaono",
    "email": "tianaday@hawaii.edu"
  },
  {
    "id": 110,
    "name": "Molecular Cell Biology at UH Manoa",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "The Molecular Cell Biology Club at UH Mānoa serves to foster student interest in the field of cell biology, promote extra-curricular educational opportunities, and support student interactions with peers and professionals who have similar interests.",
    "type": "Academic/Professional",
    "contactPerson": "Kristyn Miyamoto",
    "email": "kmmiyamo@hawaii.edu"
  },
  {
    "id": 111,
    "name": "Mortar Board National Honor Society Hui Po'okela Chapter at the University Of Hawaiʻi at Mānoa",
    "dateApproved": "11/7/25",
    "expirationDate": "9/30/26",
    "purpose": "Mortar Board Senior National Honor Society has long been recognized in the O'ahu community for its continued partnership with diverse service projects with other student clubs and non-profit organizations all over the island. This is a national collegiate honor society for students in their senior y",
    "type": "Honorary Society",
    "contactPerson": "Kayla Mishima",
    "email": "mishimak@hawaii.edu"
  },
  {
    "id": 112,
    "name": "MRUH (Marine Robotics at the University of Hawaii)",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "Team Kanaloa (MRUH) is a multidisciplinary research lab aimed at developing unmanned marine systems. The Unmanned Port Security Vessel (UPSV) is an existing maritime robot developed by the University of Hawaii at Manoa for the purpose of autonomously surveying ports for possible threats including th",
    "type": "Academic/Professional",
    "contactPerson": "Jason Kanemoto",
    "email": "jasonmka@hawaii.edu"
  },
  {
    "id": 113,
    "name": "Multiʻōlelo",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "Section 1: Goal: Multiʻōlelo’s main goal is to make language research more accessible to the general public. Section 2: Primary Functions: The primary functions of Multiʻōlelo shall be to: Promote research dissemination and scholarly exchange both within and beyond the English-speaking academy. Prov",
    "type": "Academic/Professional",
    "contactPerson": "Sarah Aartila",
    "email": "saartila@hawaii.edu"
  },
  {
    "id": 114,
    "name": "Muslim Student Association at UH Manoa",
    "dateApproved": "12/22/25",
    "expirationDate": "9/30/26",
    "purpose": "The Muslim Student Association at UHM (MSA@UHM) is established to promote personal growth and life skill development and provide students with the tools to succeed in college, in the profession, and beyond. MSA@UHM is founded on Islamic foundations and strives to serve the UH community through acade",
    "type": "Ethnic/Cultural",
    "contactPerson": "Mohammad Rafi Ahmed",
    "email": "mrahmed@hawaii.edu"
  },
  {
    "id": 115,
    "name": "Nā Lauhoe o ka Lanakila/PADDLING CLUB at the University of Hawaiʻi at Mānoa",
    "dateApproved": "10/24/25",
    "expirationDate": "9/30/26",
    "purpose": "To promote and perpetuate Hoe Waʻa (Hawaiian Outrigger Canoe paddling) within the University of Hawaiʻi community.",
    "type": "Leisure/Recreational",
    "contactPerson": "Robert Foley",
    "email": "rfoley7@hawaii.edu"
  },
  {
    "id": 116,
    "name": "NATIONAL MOCK TRIAL TEAM AT UNIVERSITY OF HAWAI‘I SCHOOL OF LAW",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "National Mock Trial Team at The University of Hawai‘i School of Law is a student organization dedicated to trial advocacy, advancing the trial advocacy skills of its members, and successfully representing the University of Hawai‘i School of Law in trial advocacy competitions across the nation. It is",
    "type": "Academic/Professional",
    "contactPerson": "Carolina Frances",
    "email": "cfrances@hawaii.edu"
  },
  {
    "id": 117,
    "name": "Natural Resources and Environmental Management Graduate Student Organization at University of Hawaiʻi at Mānoa",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "NREM Graduate Student Organization (NREM GSO) is a student-led organization that represents and advocates for graduate students in the Department of Natural Resources and Environmental Management. We provide opportunities for social and professional connections, serve as a voice for student interest",
    "type": "Academic/Professional",
    "contactPerson": "Helen Hastedt",
    "email": "hhastedt@hawaii.edu"
  },
  {
    "id": 118,
    "name": "Natural Sciences Student Ambassadors",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "Our organization strives to promote a welcoming and inclusive community for all students pursuing an undergraduate degree in the Natural Sciences. Members of our organization will act as mentors and leaders, aiding incoming students in their transition to our University and building camaraderie amon",
    "type": "Academic/Professional",
    "contactPerson": "Kurt Wong",
    "email": "kwong28@hawaii.edu"
  },
  {
    "id": 119,
    "name": "Newman Club",
    "dateApproved": "10/10/25",
    "expirationDate": "9/30/26",
    "purpose": "Newman Club is a Catholic Campus Ministry serving the University of Hawai'i at Manoa students, faculty, and staff. We are a diverse and inclusive community, a home away from home for students where \"heart speaks to heart.\" We provide life-long spiritual development, leadership skills training, retre",
    "type": "Religious/Spiritual",
    "contactPerson": "Fay Pabo",
    "email": "fayc@hawaii.edu"
  },
  {
    "id": 120,
    "name": "NMDP/Be The Match Chapter",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "As the NMDP Chapter at UH Mānoa, we believe each of us can make a significant impact in the fight against blood cancers and disorders. As a Campus Chapter under the National Marrow Donor Program® (NMDP℠), we aim to grow the marrow donor registry and expand access to life-saving treatments. Members o",
    "type": "Academic/Professional",
    "contactPerson": "Mariel Tadena",
    "email": "marielnt@hawaii.edu"
  },
  {
    "id": 121,
    "name": "Oncology Interest Group at JABSOM",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "Oncology Interest Group at JABSOM is a student run program located at the John A Burns School of Medicine whose mission is to provide students with the opportunity to gain greater exposure to the scientific, clinical and personal aspects of oncology. Help students explore interests in oncology and i",
    "type": "Academic/Professional",
    "contactPerson": "Xavier Heidelberg",
    "email": "xkh@hawaii.edu"
  },
  {
    "id": 122,
    "name": "Pacific Asian Travel Association (PATA)",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "To contribute to the sustainable and responsible development of travel and tourism in Asia Pacific through the protection of the environment, the conservation of heritage, and support for education.",
    "type": "Academic/Professional",
    "contactPerson": "Cody-John Sakamoto",
    "email": "CODY30@HAWAII.EDU"
  },
  {
    "id": 123,
    "name": "Pasifika Allies Association",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "PA‘A–meaning “firm” and “engaged” in ‘Ōlelo Hawai‘i, and “way of life” in fino Chamoru–perpetuates our collective Pasifika values of ancestors, community, family, history, heritage, reciprocity, and respect through collaborative events that provide a safe space, cultivate community, and regenerate r",
    "type": "Ethnic/Cultural",
    "contactPerson": "Waileia Tupou",
    "email": "wtupou@hawaii.edu"
  },
  {
    "id": 124,
    "name": "Patient Safety and Quality Improvement Interest Group",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the organization shall be to: 1. Provide a platform for medical student interested in patient safety and quality improvement to interact with peers who share similar interests and goals. 2. Provide opportunities for medical students to expand their knowledge on patient safety by means",
    "type": "Academic/Professional",
    "contactPerson": "Maya Nishida",
    "email": "mayakn@hawaii.edu"
  },
  {
    "id": 125,
    "name": "Pediatric Interest Group",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "The mission of this organization is to allow medical students opportunities to supplement their academic experience with events that expose them to pediatric medicine",
    "type": "Academic/Professional",
    "contactPerson": "Justin Lee",
    "email": "JustinHL@hawaii.edu"
  },
  {
    "id": 126,
    "name": "Peer Mentor Ohana",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "The Peer Mentor Ohana is a non-profit organization - by student, for student - devoted to providing academic support to students of the University of Hawaii, as well as service to the community. The primary goals of the PMO are to help students succeed in college, reach their full academic potential",
    "type": "Academic/Professional",
    "contactPerson": "Emi Obana",
    "email": "emiobana@hawaii.edu"
  },
  {
    "id": 127,
    "name": "Phi Alpha Honor Society Nu Sigma Chapter",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of Phi Alpha is to provide a closer bond among students of social work and promote humanitarian goals and ideals. Phi Alpha fosters high standards of education for social workers and invites into membership with those who have attained excellence in scholarship and achievement in social ",
    "type": "Honorary Society",
    "contactPerson": "Chelsea McDonough",
    "email": "cem2015@hawaii.edu"
  },
  {
    "id": 128,
    "name": "Phi Alpha Theta - Alpha Beta Epsilon",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "Phi Alpha Theta (PAT) is a national honor society open to all students with an interest in history—not just history majors: membership requires the completion of a certain number of history courses and a qualifying GPA.",
    "type": "Honorary Society",
    "contactPerson": "Yejun Kweon",
    "email": "yejunk@hawaii.edu"
  },
  {
    "id": 129,
    "name": "Phi Mu Fraternity",
    "dateApproved": "10/20/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the Iota Alpha Chapter shall be to encourage and promote the purpose and ideals of Phi Mu Fraternity to this campus, and to function by the rules in the Fraternity’s Constitution and Bylaws and Standing Rules and Procedures. Our mission statement is: Founded in 1852, Phi Mu is a women",
    "type": "Fraternity/Sorority",
    "contactPerson": "Rosalynn Ethany Madriaga",
    "email": "renm3@hawaii.edu"
  },
  {
    "id": 130,
    "name": "Pi Gamma Mu, the International Honor Society in the Social Sciences, Hawai'i Alpha Chapter at the University of Hawai'i at Mānoa",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "Encourage and promote excellence in the Social Sciences and to uphold and nurture scholarship, leadership, and service.",
    "type": "Academic/Professional",
    "contactPerson": "Zeven Anderson-Leonard",
    "email": "zeven@hawaii.edu"
  },
  {
    "id": 131,
    "name": "Pinoy in Engineering",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "Club PIE (Pinoy in Engineering) is a student organization at the University of Hawaiʻi at Mānoa dedicated to celebrating and sustaining Filipino culture within the college experience. Our mission is to foster a strong, supportive space for Filipino-identifying students in engineering, architecture, ",
    "type": "Academic/Professional",
    "contactPerson": "Kamryn Tiana Acoba",
    "email": "ktacoba@hawaii.edu"
  },
  {
    "id": 132,
    "name": "Planned Parenthood Generation Action at the University of Hawaii at Manoa",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "Our purpose is to mobilize advocates for reproductive freedom and to create awareness surrounding reproductive justice on our campus. We aim to be a safe space and resource for all students.",
    "type": "Political",
    "contactPerson": "Emily Kulaga",
    "email": "kulagae@hawaii.edu"
  },
  {
    "id": 133,
    "name": "Pre-Dental Association",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "To support pre-dental students by providing volunteer opportunities, meetings with dental care professionals, and coordinating specialized workshops. Through this, our main objective is to assist passionate pre-dental students become competitive dental school applicants.",
    "type": "Academic/Professional",
    "contactPerson": "Kyle Koga",
    "email": "kkoga4@hawaii.edu"
  },
  {
    "id": 134,
    "name": "Pre-Medical Association",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "To develop and stimulate a realistic understanding of healthcare professions. To expand our knowledge of admissions policies and our acceptance potential to health programs. To unite pre-health students of the University of Hawai‘i system through a unique social and intellectual fellowship. To nurtu",
    "type": "Academic/Professional",
    "contactPerson": "Joanne Wong",
    "email": "joannevw@hawaii.edu"
  },
  {
    "id": 135,
    "name": "Pre-Optometry/Ophthalmology Club",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The organization will serve as a community first UH Mānoa students interested in optometry, ophthalmology, or general vision science.",
    "type": "Academic/Professional",
    "contactPerson": "Darwin Do",
    "email": "darwindo@hawaii.edu"
  },
  {
    "id": 136,
    "name": "Pre Pharmacy Association at University of Hawai'i at Manoa",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization is to help students who are interested in the Pharmaceutical field come together to bond with fellow students as well as help each other learn more about the many different paths we can take in the Pharmacy profession.",
    "type": "Academic/Professional",
    "contactPerson": "Jaden Manuel-Basilio",
    "email": "jadenmb@hawaii.edu"
  },
  {
    "id": 137,
    "name": "Pre-Veterinary Club at the University of Hawaii at Manoa",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "The Pre-Veterinary Club at the University of Hawaii at Manoa is committed to students who share an interest and passion for animals and veterinary medicine. The club accomplishes its mission by organizing events that emphasize education and hands-on experience. The club also participates in communit",
    "type": "Academic/Professional",
    "contactPerson": "Ayla Hakikawa",
    "email": "ath8@hawaii.edu"
  },
  {
    "id": 138,
    "name": "Psi Chi, the International Honor Society in Psychology, UH Mānoa Chapter",
    "dateApproved": "10/6/25",
    "expirationDate": "9/30/26",
    "purpose": "to encourage, stimulate, and maintain excellence in scholarship of the individual members in all fields, particularly in psychology, and to advance the science of psychology",
    "type": "Honorary Society",
    "contactPerson": "Angelica Nelson",
    "email": "atnelson@hawaii.edu"
  },
  {
    "id": 139,
    "name": "Psi Sigma: The Psychology Connection",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "To serve as the connection among psychology students; facilitate social interaction and psychology discussion. We encourage the pursuit of psychological science, foster enduring connections among peers in psychology, and advance the academic and professional development of ​our members.​ Psi Sigma u",
    "type": "Academic/Professional",
    "contactPerson": "Jaydon Lai",
    "email": "jaydon8@hawaii.edu"
  },
  {
    "id": 140,
    "name": "Public Health Interest Group at JABSOM",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization is to provide public health exposure to medical students and how they can incorporate these principles into clinical medicine practice.",
    "type": "Academic/Professional",
    "contactPerson": "Diana Holden",
    "email": "dianazyh@hawaii.edu"
  },
  {
    "id": 141,
    "name": "Public Relations Student Society of America (PRSSA)",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "PRSSA strives to provide exceptional service to our members by enhancing their education, broadening their professional network and helping launch their professional careers after graduation.",
    "type": "Academic/Professional",
    "contactPerson": "Mailani Magbanua",
    "email": "Mailani4@hawaii.edu"
  },
  {
    "id": 142,
    "name": "Real Estate Club at University of Hawaii",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "To provide opportunities for networking and career development for students interested in the Real Estate industry by serving as a medium between the student body, representatives, and organizations in the field of Real Estate.",
    "type": "Academic/Professional",
    "contactPerson": "Cassie Matsumoto",
    "email": "cassiecm@hawaii.edu"
  },
  {
    "id": 143,
    "name": "Refuse Fascism Club at the University of Hawai`i at Manoa",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "Refuse Fascism Hawai`i (hereinafter “The Club”) was formed in December 2016 to expose and oppose an escalating trajectory towards fascism in the U.S. and sponsor events that enable our general membership and the public to understand what fascism is and how it is developing. In order to accomplish th",
    "type": "Political",
    "contactPerson": "Anna Stirr",
    "email": "stirr@hawaii.edu"
  },
  {
    "id": 144,
    "name": "Regents and Presidential Scholars Club",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "The Regents and Presidential Scholars (RAPS) Club is an organization dedicated to fostering a vibrant community among the accomplished recipients of the Regents and Presidential scholarships at the University of Hawai’i at Mānoa. With a primary focus on promoting student interaction and camaraderie,",
    "type": "Academic/Professional",
    "contactPerson": "Victoria Hung",
    "email": "vhung@hawaii.edu"
  },
  {
    "id": 145,
    "name": "Risk Management and Insurance Club",
    "dateApproved": "10/10/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization shall be to spread awareness of insurance as a career field. The organization will strive to provide opportunities for the students at the University of Hawaii at Manoa to be exposed to the insurance industry.",
    "type": "Academic/Professional",
    "contactPerson": "Lisa Takebe",
    "email": "ltakebe@hawaii.edu"
  },
  {
    "id": 146,
    "name": "Rotaract at UHM",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "Our organization brings people together through service, social, and professional events that foster leadership, community engagement, and global awareness. By offering meaningful opportunities both on and off campus, we aim to enrich the UH Mānoa community and empower individuals as future rotaract",
    "type": "Academic/Professional",
    "contactPerson": "Duy Linh Nguyen Tran",
    "email": "duylinh@hawaii.edu"
  },
  {
    "id": 147,
    "name": "Runners At Manoa",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "Runners at Manoa aims to connect students through recreational running and jogging. The club hopes to provide a relaxing, comfortable, and social environment for those that want to share a passion for physical activity through after-school workouts and activities. All skill levels are encouraged to ",
    "type": "Leisure/Recreational",
    "contactPerson": "Micaiah Cape",
    "email": "mcape@hawaii.edu"
  },
  {
    "id": 148,
    "name": "Rural Health Interest Group",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "The Rural Health Interest Group (RHIG) serves to promote medical practice on the neighbor islands and underserved areas of Hawaiʻi. To increase awareness about the physician shortage in Hawaii and nationwide. To educate medical students about rural health issues, and to advocate for better healthcar",
    "type": "Academic/Professional",
    "contactPerson": "Jeanette Tajiri",
    "email": "jtajiri@hawaii.edu"
  },
  {
    "id": 149,
    "name": "Salsa Dancing at UHM",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "",
    "type": "Leisure/Recreational",
    "contactPerson": "Gordon Walker",
    "email": "gwalker@hawaii.edu"
  },
  {
    "id": 150,
    "name": "Second Language Studies Student Association (SLSSA)",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "SLSSA is an association of the Students of the Second Language Studies Department at the University of Hawai’i at Mānoa. It is dedicated to developing the academic, professional, and social identities of its members. It also seeks to connect them to the career and volunteer opportunities outside the",
    "type": "Academic/Professional",
    "contactPerson": "Milang Shin",
    "email": "milangs@hawaii.edu"
  },
  {
    "id": 151,
    "name": "Sigma Theta Tau at UHM",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization is to promote nursing scholarship among students and faculty at UHM and the larger nursing community, especially those affiliated with the Sigma Theta Tau International Honor Society of Nursing professional organization. Specific activities and functions of the organ",
    "type": "Honorary Society",
    "contactPerson": "Katherine Finn Davis",
    "email": "kfdavis@hawaii.edu"
  },
  {
    "id": 152,
    "name": "Social Work Graduate Collective",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "Hui Kākoʻo SW GSO is a student-led organization that represents and advocates for students' interests and needs to the school administration and plans events and programs that promote community, professional development, and critical awareness of local and global issues. Our purpose is to create a b",
    "type": "Academic/Professional",
    "contactPerson": "Richard Dominguez",
    "email": "rpd2@hawaii.edu"
  },
  {
    "id": 153,
    "name": "Society of American Archivists Student Chapter",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of forming this student chapter was to encourage discussion and awareness of archival issues and the archival profession in Hawaii, across the United States and around the world. Today, we are fulfilling our purpose by providing our members with opportunities to explore local archives th",
    "type": "Ethnic/Cultural",
    "contactPerson": "Anna Wood",
    "email": "woodanna@hawaii.edu"
  },
  {
    "id": 154,
    "name": "Society of Physics Students (SPS) at UH Mānoa",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of SPS is to provide professional development to physics & astro students and all those interested in physics so they may become productive and responsible citizens in the larger scientific community. It also aims to foster a sense of fellowship among its members, providing them opportun",
    "type": "Academic/Professional",
    "contactPerson": "Stephen Wagner",
    "email": "swagner3@hawaii.edu"
  },
  {
    "id": 155,
    "name": "Society of Women Engineers",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "Empower women to achieve full potential in careers as engineers and leaders, expand the image of the engineering and technology professions as a positive force in improving the quality of life, and demonstrate the value of diversity and inclusion.",
    "type": "Academic/Professional",
    "contactPerson": "Rona Lei Duldulao",
    "email": "ronaleid@hawaii.edu"
  },
  {
    "id": 156,
    "name": "Soka Gakkai International (SGI) Club at the University of Hawai’i at Mānoa",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The fundamental purpose of SGI Club is to help students unlock their hidden potential and achieve creative harmony with their environment through the philosophy and practice of Nichiren Buddhism in the SGI-USA. This is the ultimate expression of individual empowerment — that each student can transfo",
    "type": "Academic/Professional",
    "contactPerson": "Kimara Alger",
    "email": "kimaraa@hawaii.edu"
  },
  {
    "id": 157,
    "name": "SPARK: Service, Passion, Action, Responsibility, and Kindness",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "\"SPARK fosters enriching experiences for UH students by encouraging them to participate in their communities through volunteer-based work. SPARK’s programs will support students in seeking out volunteer opportunities that are best suited to their passions and goals. SPARK establishes a volunteer pro",
    "type": "Academic/Professional",
    "contactPerson": "Laila Gallardo",
    "email": "lailag@hawaii.edu"
  },
  {
    "id": 158,
    "name": "Stocks and Investment Society at University of Hawai'i at Manoa",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "This group’s purpose is to provide an educational and social community for financial investments and active investing, with the focus on publicly-traded individual stocks and recognition of diverse investment strategies. Our goal is to both provide a community for experienced investors and promote a",
    "type": "Academic/Professional",
    "contactPerson": "Brandon Chang",
    "email": "changb25@hawaii.edu"
  },
  {
    "id": 159,
    "name": "Stole Society",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "Stole Society is dedicated to the manufacturing of stoles for the graduating classes for the College of Tropical Agriculture and Human Resources (CTAHR) at the University of Hawaii at Mānoa. On occasion, Stole Society will also manufacture the stoles across all majors if requested, however, we do ha",
    "type": "Academic/Professional",
    "contactPerson": "Latisha Tong",
    "email": "latishat@hawaii.edu"
  },
  {
    "id": 160,
    "name": "Student Association at the College of Education (CESA)",
    "dateApproved": "10/24/25",
    "expirationDate": "9/30/26",
    "purpose": "The general purpose and goal of the Student Association at the College of Education shall be to enhance the personal and professional growth of students of the College of Education and those preparing to enter the College of Education.",
    "type": "Academic/Professional",
    "contactPerson": "Tayne Furuta",
    "email": "tfuruta3@hawaii.edu"
  },
  {
    "id": 161,
    "name": "Student Bar Association",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "The Student Bar Association (SBA) is the student body’s advocate within the William S. Richardson School of Law campus, the larger university. SBA advocates for student interests and needs. SBA is also an umbrella organization overseeing nearly two dozen student organizations. SBA also plans social ",
    "type": "Academic/Professional",
    "contactPerson": "Zhanelyn Joy Cacho",
    "email": "zhanelyn@hawaii.edu"
  },
  {
    "id": 162,
    "name": "Students Interested in Pathology Interest Group",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The Students Interested in Pathology Interest Group aims to educate medical students about the field of Pathology through networking, mentorship, and events such as pathology lab tours and pathology-related workshops.",
    "type": "Academic/Professional",
    "contactPerson": "Jacey Mitchell",
    "email": "jaceyn@hawaii.edu"
  },
  {
    "id": 163,
    "name": "Surfrider at UH Manoa",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "To engage members of our community in community restoration and activism through beach cleanups and plastic/waste reduction",
    "type": "Service",
    "contactPerson": "Atzin Martinez",
    "email": "atzinm@hawaii.edu"
  },
  {
    "id": 164,
    "name": "Surgery Interest Group",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "To offer valuable learning opportunities and foster a welcoming environment for medical students interested in the field of surgery.",
    "type": "Academic/Professional",
    "contactPerson": "Albert Jiang",
    "email": "ahwjiang@hawaii.edu"
  },
  {
    "id": 165,
    "name": "Tadoku Talk",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this club is to allow for students studying languages (primarily Japanese and English) at the University of Hawaii to engage in reading and talking activities in the language they are studying.",
    "type": "Academic/Professional",
    "contactPerson": "Brett Mohar",
    "email": "mohar@hawaii.edu"
  },
  {
    "id": 166,
    "name": "Taiwanese Student's Association",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "To help Taiwanese students in Oahu, Hawaii, understand Hawaiian culture, traditions, and environment, while providing guidance on local resources and campus life to assist them in adapting to the new environment.",
    "type": "Ethnic/Cultural",
    "contactPerson": "Maxwell Lee",
    "email": "mcjlee@hawaii.edu"
  },
  {
    "id": 167,
    "name": "Team Hōkūlele",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "Team Hōkūlele’s mission is to design, manufacture, launch, and recover a high-powered rocket capable of reaching 25,000 feet max altitude, while providing students with valuable hands-on experience in a professional engineering project environment. The purpose of this project is to foster teamwork, ",
    "type": "Academic/Professional",
    "contactPerson": "Aidan Lee",
    "email": "Aidanl@hawaii.edu"
  },
  {
    "id": 168,
    "name": "Team RoSE (Robotic Space Exploration)",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "Team RoSE (Robotic Space Exploration) is a multidisciplinary student team competing in premier robotics challenges, including the NASA-supported RASC-AL competition and the University Rover Challenge. We unite top talent in engineering, computer science, and biochemistry to build advanced rovers, cu",
    "type": "Academic/Professional",
    "contactPerson": "Micah Tajiri",
    "email": "mtajiri@hawaii.edu"
  },
  {
    "id": 169,
    "name": "Thai Club",
    "dateApproved": "1/8/26",
    "expirationDate": "9/30/26",
    "purpose": "The mission of the Thai Club at the University of Hawai‘i at Mānoa is to create a welcoming space where students can explore, celebrate, and share Thai language, culture, and traditions. We aim to foster cross-cultural understanding, strengthen community ties, and promote pride in Thai heritage thro",
    "type": "Ethnic/Cultural",
    "contactPerson": "Kelvin Hanzlie Saraos",
    "email": "khibia@hawaii.edu"
  },
  {
    "id": 170,
    "name": "THE ETHNOMUSICOLOGY ASSOCIATION AT THE UNIVERSITY OF HAWAI‘I AT MĀNOA",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the Ethnomusicology Association is to promote world musics and cultures through education, service, and performance; to use music to help others understand social difference and to encourage mutual cooperation; and to provide support to students, scholars, and performers in music at t",
    "type": "Academic/Professional",
    "contactPerson": "Jack Hernandez",
    "email": "JackDH@Hawaii.edu"
  },
  {
    "id": 171,
    "name": "The Public Administration Student Organization at the\nUniversity of Hawai‘i at Mānoa",
    "dateApproved": "10/24/25",
    "expirationDate": "9/30/26",
    "purpose": "\"Section 1: The mission of the Public Administration Student Organization at the University of Hawai‘i at Mānoa (PASO at UHM) is to foster educational collaboration and networking among members, to provide a platform for the exchange of ideas, and to build professional relationships with the public ",
    "type": "Academic/Professional",
    "contactPerson": "Rafael Munoz",
    "email": "rcmunoz@hawaii.edu"
  },
  {
    "id": 172,
    "name": "The Society for Human Resource Management - Aloha Chapter",
    "dateApproved": "11/7/25",
    "expirationDate": "9/30/25",
    "purpose": "To provide University of Hawaii at Manoa, specifically the Shidler College of Business students with the opportunity to gain knowledge and insight into the effective management of personnel in the field of Human Resource Management through affiliation with the Hawaii Chapter of SHRM and the SHRM org",
    "type": "Academic/Professional",
    "contactPerson": "Kimberlyn Joy Agacir",
    "email": "kagacir@hawaii.edu"
  },
  {
    "id": 173,
    "name": "The Vanguard Initiative",
    "dateApproved": "11/7/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of The Vanguard Initiative is to: 1. Create a safe and affirming environment for young men of color to engage in open dialogue. 2. Foster personal, cultural, and academic development. 3. Promote leadership, accountability, and empowerment. 4. Explore identity, history, and purpose throug",
    "type": "Academic/Professional",
    "contactPerson": "Deonte Dennis",
    "email": "ddennis9@hawaii.edu"
  },
  {
    "id": 174,
    "name": "The Way of Tea Club",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "Our organization seeks to provide a place for students to practice the Urasenke school of chado (traditional Japanese tea ceremonies), as well as to preserve Japanese culture and Jakuan tea house for future generations. We also strive to promote peacefulness through a bowl of tea, which is the missi",
    "type": "Ethnic/Cultural",
    "contactPerson": "Ashley Tamura",
    "email": "tamura2@hawaii.edu"
  },
  {
    "id": 175,
    "name": "Timpuyog Organization",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "➤To serve the needs of students of the Ilokano language and literature program and others interested in the Ilokano the Ilokano language and Philippine culture. ➤To promote the Ilokano language and Philippine culture in the community. ➤To instill pride in our Ilokano heritage. ➤To develop leadership",
    "type": "Ethnic/Cultural",
    "contactPerson": "Marlon Basilio",
    "email": "marlondb@hawaii.edu"
  },
  {
    "id": 176,
    "name": "TPSS Organization of Graduate Students at the University of Hawaii at Manoa",
    "dateApproved": "10/3/25",
    "expirationDate": "9/30/26",
    "purpose": "To engender a community between TPSS students and faculty through its mission of providing educational and professional resources, opportunities, networking, and advocacy within and beyond our department.",
    "type": "Academic/Professional",
    "contactPerson": "Kenneth Kiehl",
    "email": "kkiehl@hawaii.edu"
  },
  {
    "id": 177,
    "name": "TPUSA at the University of Hawaii at Manoa",
    "dateApproved": "12/4/25",
    "expirationDate": "9/30/26",
    "purpose": "To identify, educate, train, and organize students to promote the principles of freedom, free markets, and limited government.",
    "type": "Political",
    "contactPerson": "Teagan Miley",
    "email": "tmiley@hawaii.edu"
  },
  {
    "id": 178,
    "name": "Travel Industry Management Student Association",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "TIMSA, the Travel Industry Management Student Association at the University of Hawaii at Manoa is a student-led organization, dedicated to supporting students' academic and professional journeys within the travel industry. TIMSA has provided clear pathways to success for many students and alumni, gu",
    "type": "Academic/Professional",
    "contactPerson": "Sally Citrawireja",
    "email": "sallycit@hawaii.edu"
  },
  {
    "id": 179,
    "name": "Tropical Medicine Club at the University of Hawaii at Manoa",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of this organization shall be: - Promote student interest and further improves the quality of the Microbiology programs within the University of Hawaiʻi systems and at other institutions in the state. - Promote and explain the benefits and value of HI-ASM membership to students, postdocs",
    "type": "Academic/Professional",
    "contactPerson": "Jerrisa Ching Choe",
    "email": "jching21@hawaii.edu"
  },
  {
    "id": 180,
    "name": "Ultrasound Student Interest Group",
    "dateApproved": "12/2/25",
    "expirationDate": "9/30/26",
    "purpose": "Ultrasound Student Interest Group is a JABSOM medical student organization dedicated to bringing ultrasound education to the state of Hawaii and its future healthcare providers. Nearly every medical specialty utilizes ultrasound, and this organization will provide members with the opportunity to pra",
    "type": "Academic/Professional",
    "contactPerson": "Raelynn Chu",
    "email": "rchu6@hawaii.edu"
  },
  {
    "id": 181,
    "name": "United Network of Inclusivity (UNITY) for Disabilities",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "Our purpose is to uplift the voices of students with disabilities by providing a supportive and compassionate space run by and for neurodivergent and disabled students.",
    "type": "Leisure/Recreational",
    "contactPerson": "Cecile Vimond",
    "email": "cvimond@hawaii.edu"
  },
  {
    "id": 182,
    "name": "University Students of Urban and Regional Planning",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "University Students of Urban and Regional Planning (USURP) is a departmental student council comprised of Department of Urban and Regional Planning (DURP) students. The council meets to discuss the needs of the students in efforts to discover resources and solutions that would help improve the stude",
    "type": "Academic/Professional",
    "contactPerson": "Losamalia Takayawa",
    "email": "takayawa@hawaii.edu"
  },
  {
    "id": 183,
    "name": "Vida Volunteer",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "\"VIDA is a non-profit humanitarian volunteer organization whose mission is to positively impact the quality of life in underserved communities, while offering volunteers a life-changing experience. Along with affiliated collegiate clubs at other established universities, our VIDA Hawaii team recruit",
    "type": "Service",
    "contactPerson": "James Rodden",
    "email": "jrodden8@hawaii.edu"
  },
  {
    "id": 184,
    "name": "Vietnamese Student Association at the University of Hawaii at Manoa.",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "The objectives of this organization are as follows: A. To serve the needs of students of the Vietnamese language and literature program and others interested in the Vietnamese language and Vietnamese culture. B. To promote the Vietnamese language and Vietnamese culture in the community. C. To instil",
    "type": "Ethnic/Cultural",
    "contactPerson": "Yenvy Tran",
    "email": "yenvy@hawaii.edu"
  },
  {
    "id": 185,
    "name": "VolunteerAlly at the University of Hawaiʻi at Mānoa",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of VolunteerAlly at the University of Hawai’i at Mānoa is to empower students to serve their community through meaningful, impactful volunteerism. In collaboration with VolunteerAlly.org, the chapter connects students to service opportunities, promotes civic engagement, and fosters lifel",
    "type": "Service",
    "contactPerson": "Aaron Plascencia",
    "email": "aaronpla@hawaii.edu"
  },
  {
    "id": 186,
    "name": "Warriors Triathlon at University of Hawaii",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "To cultivate students interest in triathlon and form a collaborative team of training and racing individuals.",
    "type": "Leisure/Recreational",
    "contactPerson": "Amber Chong",
    "email": "chonga4@hawaii.edu"
  },
  {
    "id": 187,
    "name": "Whining & Dining Club",
    "dateApproved": "10/31/25",
    "expirationDate": "9/30/26",
    "purpose": "Breaking down barriers between majors and build relationships with students they may not have otherwise interacted with, the club aims to foster a sense of community on campus and create a space where students can expand their culinary horizons and connect with others.",
    "type": "Leisure/Recreational",
    "contactPerson": "Jenny Brown",
    "email": "jennyeb@hawaii.edu"
  },
  {
    "id": 188,
    "name": "Women in STEM",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The mission of the Women in STEM Club is to support, empower, and elevate undergraduate university students who identify as women or women-aligned individuals pursuing degrees and careers in science, technology, engineering, and mathematics (STEM). We aim to build an inclusive campus community that ",
    "type": "Academic/Professional",
    "contactPerson": "Aisha Vaughan",
    "email": "aishabv@hawaii.edu"
  },
  {
    "id": 189,
    "name": "Women in Surgery Interest Group at JABSOM",
    "dateApproved": "9/30/25",
    "expirationDate": "9/30/26",
    "purpose": "The purpose of the Women in Surgery Interest group is to support women entering the male-dominated field of surgery by promoting education, networking events, and ongoing discussion of how to increase representation within the field.",
    "type": "Academic/Professional",
    "contactPerson": "D-Dré Wright",
    "email": "ddre@hawaii.edu"
  },
  {
    "id": 190,
    "name": "Young Skål",
    "dateApproved": "11/7/25",
    "expirationDate": "9/30/26",
    "purpose": "To develop friendship and common purpose between the students of the educational establishment, by participating in areas related to the tourism industry, and also in cultural, sports, travel and public relations activities. To encourage and assist in the tourism education or experience of the membe",
    "type": "Leisure/Recreational",
    "contactPerson": "Chassidy Sakamoto",
    "email": "cksakamo@hawaii.edu"
  },
  {
    "id": 191,
    "name": "Zen_Ohana",
    "dateApproved": "10/21/25",
    "expirationDate": "9/30/26",
    "purpose": "a Yoga class with the goal to gather students, staff and faculty, in a friendly and supportive environment to get to know each other, have fun, relax, release stress, improve physical and mental health, improve memory, coordination etc.",
    "type": "Leisure/Recreational",
    "contactPerson": "Katy Tarrit",
    "email": "katytm7@hawaii.edu"
  }
];

const clubTypes = [
  "All",
  "Academic/Professional",
  "Leisure/Recreational", 
  "Religious/Spiritual",
  "Fraternity/Sorority",
  "Ethnic/Cultural",
  "Honorary Society",
  "Political",
  "Service"
];

const typeColors: Record<string, string> = {
  "Academic/Professional": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Leisure/Recreational": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Religious/Spiritual": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Fraternity/Sorority": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "Ethnic/Cultural": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "Honorary Society": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Political": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "Service": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
};

export default function Clubs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [expandedClub, setExpandedClub] = useState<number | null>(null);

  const filteredClubs = useMemo(() => {
    return clubsData.filter((club) => {
      const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "All" || club.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { All: clubsData.length };
    clubsData.forEach((club) => {
      counts[club.type] = (counts[club.type] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="safe-p pt-8 pb-20 md:pl-72 md:pt-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-primary mb-2">Clubs & Organizations</h1>
          <p className="text-muted-foreground">Discover and connect with {clubsData.length} registered student organizations at UH Manoa</p>
        </div>

        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 pt-2 -mt-2">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search clubs by name, purpose, or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-white dark:bg-card border-border text-base"
              data-testid="input-search-clubs"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
                data-testid="button-clear-search"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {clubTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="rounded-full whitespace-nowrap flex-shrink-0"
                data-testid={`filter-${type.toLowerCase().replace(/\//g, "-")}`}
              >
                <Filter className="w-3 h-3 mr-1" />
                {type} ({typeCounts[type] || 0})
              </Button>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Showing {filteredClubs.length} of {clubsData.length} organizations
        </div>

        <div className="space-y-3">
          {filteredClubs.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-bold text-lg mb-2">No clubs found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedType("All"); }} data-testid="button-reset-filters">
                Reset Filters
              </Button>
            </Card>
          ) : (
            filteredClubs.map((club) => (
              <Card
                key={club.id}
                className="overflow-hidden transition-all hover-elevate cursor-pointer"
                onClick={() => setExpandedClub(expandedClub === club.id ? null : club.id)}
                data-testid={`club-card-${club.id}`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-bold text-base">{club.name}</h3>
                        <Badge className={`text-xs ${typeColors[club.type] || "bg-gray-100 text-gray-800"}`}>
                          {club.type}
                        </Badge>
                      </div>
                      <p className={`text-sm text-muted-foreground ${expandedClub === club.id ? "" : "line-clamp-2"}`}>
                        {club.purpose}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0" data-testid={`button-expand-${club.id}`}>
                      {expandedClub === club.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>

                  {expandedClub === club.id && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Contact:</span>
                        <span className="font-medium">{club.contactPerson}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a 
                          href={`mailto:${club.email}`} 
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                          data-testid={`link-email-${club.id}`}
                        >
                          {club.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Approved:</span>
                        <span>{club.dateApproved}</span>
                        <span className="text-muted-foreground mx-1">|</span>
                        <span className="text-muted-foreground">Expires:</span>
                        <span>{club.expirationDate}</span>
                      </div>
                      <div className="pt-2">
                        <Button 
                          size="sm" 
                          onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${club.email}?subject=Interest in ${club.name}`; }}
                          data-testid={`button-contact-${club.id}`}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Contact Club
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="mt-8 p-4 bg-muted/30 rounded-2xl text-center text-sm text-muted-foreground">
          <p>Data sourced from UH Manoa Registered Independent Organizations (RIOs)</p>
          <p className="text-xs mt-1">Last updated: December 2025</p>
        </div>
      </div>
    </div>
  );
}
