export const courseCategories = {
  programming: {
    name: "Programming",
    icon: "💻",
    description: "Learn programming languages and software development",
    subcategories: {
      python: {
        name: "Python",
        icon: "🐍",
        topics: [
          { id: "complete", name: "Complete Language", description: "Learn Python from basics to advanced" },
          { id: "basics", name: "Basics & Syntax", description: "Variables, data types, operators" },
          { id: "control", name: "Control Structures", description: "Loops, conditions, functions" },
          { id: "oop", name: "Object-Oriented Programming", description: "Classes, objects, inheritance" },
          { id: "datastructures", name: "Data Structures", description: "Lists, dictionaries, sets, tuples" },
          { id: "algorithms", name: "Algorithms", description: "Sorting, searching, recursion" },
          { id: "web", name: "Web Development", description: "Django, Flask, FastAPI" },
          { id: "datascience", name: "Data Science", description: "NumPy, Pandas, Matplotlib" },
          { id: "ml", name: "Machine Learning", description: "Scikit-learn, TensorFlow" }
        ]
      },
      javascript: {
        name: "JavaScript",
        icon: "🟨",
        topics: [
          { id: "complete", name: "Complete Language", description: "Learn JavaScript from basics to advanced" },
          { id: "basics", name: "Basics & Syntax", description: "Variables, functions, objects" },
          { id: "dom", name: "DOM Manipulation", description: "HTML interaction, events" },
          { id: "async", name: "Asynchronous Programming", description: "Promises, async/await" },
          { id: "es6", name: "ES6+ Features", description: "Arrow functions, destructuring" },
          { id: "react", name: "React Development", description: "Components, hooks, state" },
          { id: "nodejs", name: "Node.js", description: "Server-side JavaScript" },
          { id: "apis", name: "API Integration", description: "Fetch, REST APIs" }
        ]
      },
      java: {
        name: "Java",
        icon: "☕",
        topics: [
          { id: "complete", name: "Complete Language", description: "Learn Java from basics to advanced" },
          { id: "basics", name: "Java Fundamentals", description: "Syntax, variables, methods" },
          { id: "oop", name: "Object-Oriented Programming", description: "Classes, inheritance, polymorphism" },
          { id: "collections", name: "Collections Framework", description: "ArrayList, HashMap, Set" },
          { id: "multithreading", name: "Multithreading", description: "Threads, synchronization" },
          { id: "spring", name: "Spring Framework", description: "Spring Boot, MVC" },
          { id: "database", name: "Database Integration", description: "JDBC, JPA, Hibernate" }
        ]
      },
      cpp: {
        name: "C++",
        icon: "⚡",
        topics: [
          { id: "complete", name: "Complete Language", description: "Learn C++ from basics to advanced" },
          { id: "basics", name: "C++ Fundamentals", description: "Syntax, variables, functions" },
          { id: "oop", name: "Object-Oriented Programming", description: "Classes, objects, inheritance" },
          { id: "pointers", name: "Pointers & Memory", description: "Pointers, references, memory management" },
          { id: "stl", name: "Standard Template Library", description: "Containers, algorithms, iterators" },
          { id: "advanced", name: "Advanced C++", description: "Templates, exceptions, file I/O" }
        ]
      },
      csharp: {
        name: "C#",
        icon: "🔷",
        topics: [
          { id: "complete", name: "Complete Language", description: "Learn C# from basics to advanced" },
          { id: "basics", name: "C# Fundamentals", description: "Syntax, variables, methods" },
          { id: "oop", name: "Object-Oriented Programming", description: "Classes, inheritance, interfaces" },
          { id: "dotnet", name: ".NET Framework", description: "ASP.NET, Entity Framework" },
          { id: "web", name: "Web Development", description: "ASP.NET Core, MVC" }
        ]
      },
      other: {
        name: "Other Programming Language",
        icon: "📝",
        topics: [
          { id: "custom", name: "Custom Topic", description: "Enter your own programming topic" }
        ]
      }
    }
  },
  competitive: {
    name: "Competitive Exams",
    icon: "🏆",
    description: "Prepare for competitive examinations",
    subcategories: {
      jee: {
        name: "JEE Main/Advanced",
        icon: "🎯",
        subjects: [
          { id: "physics", name: "Physics", topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics"] },
          { id: "chemistry", name: "Chemistry", topics: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"] },
          { id: "mathematics", name: "Mathematics", topics: ["Algebra", "Calculus", "Coordinate Geometry", "Trigonometry", "Statistics"] }
        ]
      },
      neet: {
        name: "NEET",
        icon: "🩺",
        subjects: [
          { id: "physics", name: "Physics", topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics"] },
          { id: "chemistry", name: "Chemistry", topics: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"] },
          { id: "biology", name: "Biology", topics: ["Botany", "Zoology", "Human Physiology", "Genetics"] }
        ]
      },
      upsc: {
        name: "UPSC Civil Services",
        icon: "🏛️",
        subjects: [
          { id: "prelims", name: "Prelims", topics: ["General Studies Paper 1", "General Studies Paper 2 (CSAT)"] },
          { id: "mains", name: "Mains", topics: ["Essay", "General Studies 1-4", "Optional Subject"] }
        ]
      },
      gate: {
        name: "GATE",
        icon: "⚙️",
        subjects: [
          { id: "cse", name: "Computer Science", topics: ["Programming", "Data Structures", "Algorithms", "DBMS", "Networks"] },
          { id: "ece", name: "Electronics", topics: ["Analog Circuits", "Digital Circuits", "Signals & Systems"] },
          { id: "mechanical", name: "Mechanical", topics: ["Thermodynamics", "Fluid Mechanics", "Machine Design"] }
        ]
      },
      ssc: {
        name: "SSC CGL",
        icon: "🏛️",
        subjects: [
          { id: "reasoning", name: "General Intelligence & Reasoning", topics: ["Logical Reasoning", "Analytical Reasoning", "Verbal Reasoning", "Non-Verbal Reasoning"] },
          { id: "awareness", name: "General Awareness", topics: ["Current Affairs", "History", "Geography", "Polity", "Economics", "Science"] },
          { id: "quantitative", name: "Quantitative Aptitude", topics: ["Arithmetic", "Algebra", "Geometry", "Trigonometry", "Statistics"] },
          { id: "english", name: "English Comprehension", topics: ["Reading Comprehension", "Grammar", "Vocabulary", "Sentence Correction"] }
        ]
      },
      other: {
        name: "Other Competitive Exam",
        icon: "📝",
        subjects: [
          { id: "custom", name: "Custom Exam", topics: ["Custom Topic"] }
        ]
      }
    }
  },
  college: {
    name: "College Syllabus",
    icon: "🎓",
    description: "Follow your college curriculum",
    branches: {
      cse: {
        name: "Computer Science Engineering",
        semesters: {
          1: ["Programming Fundamentals", "Mathematics 1", "Physics", "Chemistry", "English"],
          2: ["Data Structures", "Mathematics 2", "Digital Logic", "Engineering Graphics"],
          3: ["Object Oriented Programming", "Database Systems", "Computer Organization", "Discrete Mathematics"],
          4: ["Operating Systems", "Computer Networks", "Software Engineering", "Theory of Computation"],
          5: ["Machine Learning", "Compiler Design", "Web Technologies", "Elective 1"],
          6: ["Artificial Intelligence", "Mobile Computing", "Cloud Computing", "Elective 2"],
          7: ["Project Work", "Internship", "Advanced Topics", "Elective 3"],
          8: ["Final Project", "Seminar", "Industry Training"]
        }
      },
      ece: {
        name: "Electronics & Communication",
        semesters: {
          1: ["Basic Electronics", "Mathematics 1", "Physics", "Chemistry", "English"],
          2: ["Circuit Analysis", "Mathematics 2", "Electronic Devices", "Engineering Graphics"],
          3: ["Analog Electronics", "Digital Electronics", "Signals & Systems", "Electromagnetic Theory"],
          4: ["Microprocessors", "Communication Systems", "Control Systems", "VLSI Design"],
          5: ["Digital Signal Processing", "Antenna Theory", "Microwave Engineering", "Elective 1"],
          6: ["Embedded Systems", "Optical Communication", "Satellite Communication", "Elective 2"],
          7: ["Project Work", "VLSI Technology", "Advanced Communication", "Elective 3"],
          8: ["Final Project", "Seminar", "Industry Training"]
        }
      },
      mechanical: {
        name: "Mechanical Engineering",
        semesters: {
          1: ["Engineering Mechanics", "Mathematics 1", "Physics", "Chemistry", "Workshop"],
          2: ["Strength of Materials", "Mathematics 2", "Thermodynamics", "Engineering Graphics"],
          3: ["Fluid Mechanics", "Machine Design", "Manufacturing Processes", "Material Science"],
          4: ["Heat Transfer", "Dynamics of Machinery", "Production Technology", "Automobile Engineering"],
          5: ["IC Engines", "Refrigeration", "Industrial Engineering", "Elective 1"],
          6: ["Power Plant Engineering", "Mechatronics", "CAD/CAM", "Elective 2"],
          7: ["Project Work", "Advanced Manufacturing", "Robotics", "Elective 3"],
          8: ["Final Project", "Seminar", "Industry Training"]
        }
      },
      other: {
        name: "Other Engineering Branch",
        semesters: {
          1: ["Custom Subject 1", "Custom Subject 2", "Custom Subject 3"],
          2: ["Custom Subject 1", "Custom Subject 2", "Custom Subject 3"]
        }
      }
    }
  },
  skills: {
    name: "Skill-based Courses",
    icon: "🛠️",
    description: "Learn practical skills for career growth",
    categories: {
      design: {
        name: "Design & Creative",
        skills: [
          { id: "ui-ux", name: "UI/UX Design", description: "User interface and experience design" },
          { id: "graphic", name: "Graphic Design", description: "Visual design and branding" },
          { id: "web-design", name: "Web Design", description: "Website design and prototyping" },
          { id: "video", name: "Video Editing", description: "Video production and editing" }
        ]
      },
      business: {
        name: "Business & Management",
        skills: [
          { id: "digital-marketing", name: "Digital Marketing", description: "Online marketing strategies" },
          { id: "project-management", name: "Project Management", description: "Planning and execution" },
          { id: "data-analysis", name: "Data Analysis", description: "Business intelligence and analytics" },
          { id: "leadership", name: "Leadership", description: "Team management and leadership" }
        ]
      },
      technical: {
        name: "Technical Skills",
        skills: [
          { id: "cloud", name: "Cloud Computing", description: "AWS, Azure, Google Cloud" },
          { id: "devops", name: "DevOps", description: "CI/CD, Docker, Kubernetes" },
          { id: "cybersecurity", name: "Cybersecurity", description: "Security practices and tools" },
          { id: "blockchain", name: "Blockchain", description: "Cryptocurrency and smart contracts" }
        ]
      },
      other: {
        name: "Other Skills",
        skills: [
          { id: "custom", name: "Custom Skill", description: "Enter your own skill to learn" }
        ]
      }
    }
  },
  certifications: {
    name: "Professional Certifications",
    icon: "📜",
    description: "Prepare for industry certifications",
    providers: {
      aws: {
        name: "Amazon Web Services",
        certifications: [
          { id: "cloud-practitioner", name: "AWS Cloud Practitioner", level: "Foundational" },
          { id: "solutions-architect", name: "AWS Solutions Architect", level: "Associate" },
          { id: "developer", name: "AWS Developer", level: "Associate" },
          { id: "sysops", name: "AWS SysOps Administrator", level: "Associate" }
        ]
      },
      google: {
        name: "Google Cloud",
        certifications: [
          { id: "cloud-digital-leader", name: "Cloud Digital Leader", level: "Foundational" },
          { id: "associate-cloud-engineer", name: "Associate Cloud Engineer", level: "Associate" },
          { id: "professional-cloud-architect", name: "Professional Cloud Architect", level: "Professional" }
        ]
      },
      microsoft: {
        name: "Microsoft",
        certifications: [
          { id: "azure-fundamentals", name: "Azure Fundamentals", level: "Foundational" },
          { id: "azure-administrator", name: "Azure Administrator", level: "Associate" },
          { id: "azure-developer", name: "Azure Developer", level: "Associate" }
        ]
      },
      cisco: {
        name: "Cisco",
        certifications: [
          { id: "ccna", name: "CCNA", level: "Associate" },
          { id: "ccnp", name: "CCNP", level: "Professional" },
          { id: "ccie", name: "CCIE", level: "Expert" }
        ]
      },
      other: {
        name: "Other Certification",
        certifications: [
          { id: "custom", name: "Custom Certification", level: "Custom" }
        ]
      }
    }
  },
  languages: {
    name: "Language Learning",
    icon: "🌍",
    description: "Learn new languages",
    languages: {
      english: {
        name: "English",
        flag: "🇺🇸",
        levels: [
          { id: "beginner", name: "Beginner (A1-A2)", description: "Basic vocabulary and grammar" },
          { id: "intermediate", name: "Intermediate (B1-B2)", description: "Conversational skills" },
          { id: "advanced", name: "Advanced (C1-C2)", description: "Fluency and professional communication" }
        ],
        skills: ["Grammar", "Vocabulary", "Speaking", "Listening", "Reading", "Writing"]
      },
      spanish: {
        name: "Spanish",
        flag: "🇪🇸",
        levels: [
          { id: "beginner", name: "Beginner (A1-A2)", description: "Basic vocabulary and grammar" },
          { id: "intermediate", name: "Intermediate (B1-B2)", description: "Conversational skills" },
          { id: "advanced", name: "Advanced (C1-C2)", description: "Fluency and professional communication" }
        ],
        skills: ["Grammar", "Vocabulary", "Speaking", "Listening", "Reading", "Writing"]
      },
      french: {
        name: "French",
        flag: "🇫🇷",
        levels: [
          { id: "beginner", name: "Beginner (A1-A2)", description: "Basic vocabulary and grammar" },
          { id: "intermediate", name: "Intermediate (B1-B2)", description: "Conversational skills" },
          { id: "advanced", name: "Advanced (C1-C2)", description: "Fluency and professional communication" }
        ],
        skills: ["Grammar", "Vocabulary", "Speaking", "Listening", "Reading", "Writing"]
      },
      german: {
        name: "German",
        flag: "🇩🇪",
        levels: [
          { id: "beginner", name: "Beginner (A1-A2)", description: "Basic vocabulary and grammar" },
          { id: "intermediate", name: "Intermediate (B1-B2)", description: "Conversational skills" },
          { id: "advanced", name: "Advanced (C1-C2)", description: "Fluency and professional communication" }
        ],
        skills: ["Grammar", "Vocabulary", "Speaking", "Listening", "Reading", "Writing"]
      },
      other: {
        name: "Other Language",
        flag: "🌐",
        levels: [
          { id: "beginner", name: "Beginner", description: "Basic level" },
          { id: "intermediate", name: "Intermediate", description: "Conversational level" },
          { id: "advanced", name: "Advanced", description: "Fluent level" }
        ],
        skills: ["Grammar", "Vocabulary", "Speaking", "Listening", "Reading", "Writing"]
      }
    }
  }
};

// Add a new category for completely custom courses
export const customCourseCategory = {
  name: "Custom Course",
  icon: "✨",
  description: "Enter any course or topic you want to learn"
};