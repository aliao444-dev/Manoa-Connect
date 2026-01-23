import { useState } from "react";
import { useScholarships } from "@/hooks/use-scholarships";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, DollarSign, Calendar, Users, ExternalLink, Search, Filter, Loader2, Sparkles } from "lucide-react";
import type { Scholarship } from "@shared/schema";

const categoryColors: Record<string, string> = {
  "General": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Merit": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Need-Based": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Major-Specific": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "Community": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
};

export default function Scholarships() {
  const { data: scholarships = [], isLoading } = useScholarships();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredScholarships = scholarships.filter((s: Scholarship) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.provider.toLowerCase().includes(search.toLowerCase()) ||
                          s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(scholarships.map((s: Scholarship) => s.category)));

  return (
    <div className="min-h-screen bg-background md:ml-64">
      <div className="relative bg-gradient-to-br from-primary via-primary to-emerald-600 py-16 px-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30" data-testid="badge-scholarships">
            <Sparkles className="w-3 h-3 mr-1" />
            Financial Aid
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Scholarships
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Discover scholarship opportunities for UH Manoa students. From the UH Common Application to HCF grants, find funding for your education.
          </p>
        </div>
      </div>

      <div className="safe-p py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search scholarships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search-scholarships"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-category-filter">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover-elevate" data-testid="card-uh-common-app">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">UH Common Application</CardTitle>
                  <CardDescription className="text-blue-600 dark:text-blue-300">University of Hawaii</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                One application for hundreds of UH scholarships. Submit once and be considered for all matching awards.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Up to $20,000</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>March 1</span>
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href="https://uhfoundation.org/scholarships" target="_blank" rel="noopener noreferrer">
                  Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800 hover-elevate" data-testid="card-hcf">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">HCF Scholarships</CardTitle>
                  <CardDescription className="text-emerald-600 dark:text-emerald-300">Hawai'i Community Foundation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Over 200 scholarship funds supporting students from diverse backgrounds, majors, and islands.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-medium">$1,000 - $10,000</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>January 31</span>
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href="https://www.hawaiicommunityfoundation.org/scholarships" target="_blank" rel="noopener noreferrer">
                  Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <h2 className="font-display font-bold text-2xl mb-4">All Scholarships</h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No scholarships found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScholarships.map((scholarship: Scholarship) => (
              <Card key={scholarship.id} className="hover-elevate" data-testid={`card-scholarship-${scholarship.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className={categoryColors[scholarship.category] || "bg-gray-100 text-gray-800"}>
                      {scholarship.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{scholarship.name}</CardTitle>
                  <CardDescription>{scholarship.provider}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{scholarship.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{scholarship.amount}</span>
                    </div>
                    {scholarship.deadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span>Deadline: {scholarship.deadline}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      <strong>Eligibility:</strong> {scholarship.eligibility}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  {scholarship.applicationUrl ? (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                        Learn More <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Contact Financial Aid
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}
