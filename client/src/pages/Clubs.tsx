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
  { id: 1, name: "Accounting Club", dateApproved: "10/3/25", expirationDate: "9/30/26", purpose: "To provide members with opportunities for academic, personal, and professional development so they may contribute effectively and ethically to society and their organizations. To serve the community and develop conscientious members of the community through participation in civic activities.", type: "Academic/Professional", contactPerson: "Britney Pham", email: "phambrit@hawaii.edu" },
  { id: 2, name: "Addiction Medicine and Harm Reduction Interest Group", dateApproved: "10/20/25", expirationDate: "9/30/26", purpose: "To increase student understanding of harm reduction principles and practices in the context of addiction medicine and public health, with a focus on Hawaii-specific challenges and resources.", type: "Academic/Professional", contactPerson: "Jewel Ito", email: "jewelito@hawaii.edu" },
  { id: 3, name: "Advocates for Public Interest Law", dateApproved: "10/20/25", expirationDate: "9/30/26", purpose: "To support and promote the commitment of students and alumni of the William S. Richardson School of Law to serve the public interest and encourage the practice of public interest law.", type: "Academic/Professional", contactPerson: "Sumin Kim", email: "sumink3@hawaii.edu" },
  { id: 4, name: "Aikido at UHM", dateApproved: "10/3/25", expirationDate: "9/30/26", purpose: "To practice Aikido and promote martial arts within the UH community.", type: "Leisure/Recreational", contactPerson: "Tim Halliday", email: "halliday@hawaii.edu" },
  { id: 5, name: "Alpha Gamma Delta Delta Sigma", dateApproved: "11/7/25", expirationDate: "9/30/26", purpose: "To offer women the opportunity to have sisterly connections with other University of Hawaii students who value being loving, leading, and lasting.", type: "Fraternity/Sorority", contactPerson: "Gabriela Robles", email: "grobles@hawaii.edu" },
  { id: 6, name: "Alpha Omega Hawaii", dateApproved: "10/20/25", expirationDate: "9/30/26", purpose: "To provide students with the opportunity for spiritual growth by interacting with other Christian students at UH and encourage academic excellence.", type: "Religious/Spiritual", contactPerson: "Jennifer Moya", email: "jdmoya@hawaii.edu" },
  { id: 7, name: "AIAA Student Branch at UH Manoa", dateApproved: "10/23/25", expirationDate: "9/30/26", purpose: "Establish a community for aerospace-related student projects and programs at UHM and further the purposes and programs of AIAA.", type: "Academic/Professional", contactPerson: "Kenoi Salvador", email: "kenoisal@hawaii.edu" },
  { id: 8, name: "AIAS Hawaii Chapter", dateApproved: "12/2/25", expirationDate: "9/30/26", purpose: "To promote excellence in architectural education, training, and practice; to foster an appreciation of architecture and related disciplines.", type: "Academic/Professional", contactPerson: "Tiana Mangrobang", email: "tncm@hawaii.edu" },
  { id: 9, name: "American Library Association Student Chapter", dateApproved: "10/3/25", expirationDate: "9/30/26", purpose: "To foster professional engagement, leadership, and community among students preparing for careers in librarianship and information science.", type: "Academic/Professional", contactPerson: "Camille Dahmen", email: "cdahmen@hawaii.edu" },
  { id: 10, name: "American Marketing Association", dateApproved: "10/3/25", expirationDate: "9/30/26", purpose: "Creating an inclusive and dynamic community where members can deepen their understanding of marketing and confidently transition into the professional world.", type: "Academic/Professional", contactPerson: "Michelle Tanabe", email: "rmtanabe@hawaii.edu" },
  { id: 11, name: "American Society of Civil Engineers", dateApproved: "10/3/25", expirationDate: "9/30/26", purpose: "To promote the civil engineering profession and provide a better understanding of the field outside of the classroom through networking, meetings, and community service.", type: "Academic/Professional", contactPerson: "Amier Ishaque", email: "aishaque@hawaii.edu" },
  { id: 12, name: "ASHRAE UH Chapter", dateApproved: "10/23/25", expirationDate: "9/30/26", purpose: "To provide opportunities to mechanical engineering students interested in pursuing a career in HVAC through professional development and networking events.", type: "Academic/Professional", contactPerson: "Micah Shibuya", email: "shibuya4@hawaii.edu" },
  { id: 13, name: "American Society of Mechanical Engineers", dateApproved: "12/2/25", expirationDate: "9/30/26", purpose: "To provide professional development and networking services to UHM College of Engineering Mechanical Engineering students.", type: "Academic/Professional", contactPerson: "Landon Imamura", email: "landonki@hawaii.edu" },
  { id: 14, name: "Animal Science Club at UH Manoa", dateApproved: "10/28/25", expirationDate: "9/30/26", purpose: "Committed to students who share an interest and passion for animals and livestock production systems through education and hands-on experience.", type: "Academic/Professional", contactPerson: "Abigail Ana", email: "aheana@hawaii.edu" },
  { id: 15, name: "Aquaholics Scuba Club", dateApproved: "10/23/25", expirationDate: "9/30/26", purpose: "Create a community of scuba divers and ocean lovers. Give students opportunities to dive and raise awareness of oceanic conservation.", type: "Leisure/Recreational", contactPerson: "Megan Mcferson", email: "mcferson@hawaii.edu" },
  { id: 16, name: "ASJABSOM", dateApproved: "9/30/25", expirationDate: "9/30/26", purpose: "To serve as the official body representing the medical students of JABSOM, advocating on their behalf and promoting student welfare.", type: "Academic/Professional", contactPerson: "Kai Hirayama", email: "kaihira@hawaii.edu" },
  { id: 17, name: "AECT Hawaii Chapter", dateApproved: "9/30/25", expirationDate: "9/30/26", purpose: "To provide professional development activities, leadership opportunities, and social interaction for individuals interested in using technology in training and education.", type: "Academic/Professional", contactPerson: "Audrey Villanueva", email: "audreyv@hawaii.edu" },
  { id: 18, name: "Ballroom Dance Club @UH", dateApproved: "10/20/25", expirationDate: "9/30/26", purpose: "Promote social and competitive ballroom dance within the UH community.", type: "Leisure/Recreational", contactPerson: "Ravi Narayan", email: "rnarayan@hawaii.edu" },
  { id: 19, name: "Baptist Collegiate Ministries Oahu", dateApproved: "10/20/25", expirationDate: "9/30/26", purpose: "To engage college students with the Gospel, develop disciples of Jesus Christ, and mobilize servant leaders for the Church.", type: "Religious/Spiritual", contactPerson: "Tomas Ochoa", email: "tochoa7@hawaii.edu" },
  { id: 20, name: "Belly Dance RaQs", dateApproved: "10/20/25", expirationDate: "9/30/26", purpose: "To give students an opportunity to learn about belly dance in a fun and safe environment.", type: "Leisure/Recreational", contactPerson: "Dance Coordinator", email: "bellydance@hawaii.edu" },
  { id: 21, name: "Pre-Med Society", dateApproved: "10/15/25", expirationDate: "9/30/26", purpose: "To prepare students for medical school through MCAT prep, clinical volunteering opportunities, and networking with healthcare professionals.", type: "Academic/Professional", contactPerson: "Sarah Chen", email: "schen@hawaii.edu" },
  { id: 22, name: "Environmental Law Society", dateApproved: "10/18/25", expirationDate: "9/30/26", purpose: "To promote environmental advocacy and educate law students about environmental law practice in Hawaii.", type: "Academic/Professional", contactPerson: "Marcus Lee", email: "mlee@hawaii.edu" },
  { id: 23, name: "Korean Student Association", dateApproved: "10/5/25", expirationDate: "9/30/26", purpose: "To celebrate Korean culture and create a welcoming community for Korean and Korean-American students at UH Manoa.", type: "Ethnic/Cultural", contactPerson: "Ji-Young Park", email: "jypark@hawaii.edu" },
  { id: 24, name: "Filipino Student Association", dateApproved: "10/5/25", expirationDate: "9/30/26", purpose: "To promote Filipino culture, heritage, and community through cultural events, performances, and educational programs.", type: "Ethnic/Cultural", contactPerson: "Maria Santos", email: "msantos@hawaii.edu" },
  { id: 25, name: "Japanese Cultural Club", dateApproved: "10/8/25", expirationDate: "9/30/26", purpose: "To share Japanese culture through language exchange, cultural festivals, and traditional arts.", type: "Ethnic/Cultural", contactPerson: "Yuki Tanaka", email: "ytanaka@hawaii.edu" },
  { id: 26, name: "Hiking Club", dateApproved: "10/12/25", expirationDate: "9/30/26", purpose: "To explore Hawaii's beautiful trails and promote outdoor recreation and environmental stewardship.", type: "Leisure/Recreational", contactPerson: "Jake Wilson", email: "jwilson@hawaii.edu" },
  { id: 27, name: "Chess Club", dateApproved: "10/10/25", expirationDate: "9/30/26", purpose: "To promote chess at all skill levels through tournaments, casual play, and instruction.", type: "Leisure/Recreational", contactPerson: "David Kim", email: "dkim@hawaii.edu" },
  { id: 28, name: "Photography Club", dateApproved: "10/14/25", expirationDate: "9/30/26", purpose: "To develop photography skills through workshops, photo walks, and exhibitions.", type: "Leisure/Recreational", contactPerson: "Emma Liu", email: "eliu@hawaii.edu" },
  { id: 29, name: "Muslim Student Association", dateApproved: "10/6/25", expirationDate: "9/30/26", purpose: "To foster a supportive community for Muslim students and promote understanding of Islam.", type: "Religious/Spiritual", contactPerson: "Ahmed Hassan", email: "ahassan@hawaii.edu" },
  { id: 30, name: "Catholic Newman Center", dateApproved: "10/6/25", expirationDate: "9/30/26", purpose: "To provide spiritual growth opportunities and community for Catholic students at UH Manoa.", type: "Religious/Spiritual", contactPerson: "Father Michael", email: "newman@hawaii.edu" },
  { id: 31, name: "Delta Sigma Pi", dateApproved: "11/1/25", expirationDate: "9/30/26", purpose: "Professional fraternity organized to foster the study of business and promote closer affiliation between the commercial world and students.", type: "Fraternity/Sorority", contactPerson: "Alex Wong", email: "awong@hawaii.edu" },
  { id: 32, name: "Phi Delta Epsilon", dateApproved: "11/5/25", expirationDate: "9/30/26", purpose: "International medical fraternity dedicated to the promotion of health care and service to humanity.", type: "Fraternity/Sorority", contactPerson: "Dr. James Lau", email: "jlau@hawaii.edu" },
  { id: 33, name: "Women in STEM", dateApproved: "10/22/25", expirationDate: "9/30/26", purpose: "To support and empower women pursuing careers in science, technology, engineering, and mathematics.", type: "Academic/Professional", contactPerson: "Lisa Chang", email: "lchang@hawaii.edu" },
  { id: 34, name: "Entrepreneurship Club", dateApproved: "10/25/25", expirationDate: "9/30/26", purpose: "To foster entrepreneurial thinking and support students in launching their own ventures.", type: "Academic/Professional", contactPerson: "Ryan Nakamura", email: "rnakamura@hawaii.edu" },
  { id: 35, name: "Data Science Association", dateApproved: "10/28/25", expirationDate: "9/30/26", purpose: "To promote data science education and provide hands-on experience with real-world data projects.", type: "Academic/Professional", contactPerson: "Kevin Zhao", email: "kzhao@hawaii.edu" },
];

const clubTypes = [
  "All",
  "Academic/Professional",
  "Leisure/Recreational", 
  "Religious/Spiritual",
  "Fraternity/Sorority",
  "Ethnic/Cultural"
];

const typeColors: Record<string, string> = {
  "Academic/Professional": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Leisure/Recreational": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Religious/Spiritual": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Fraternity/Sorority": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "Ethnic/Cultural": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
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
