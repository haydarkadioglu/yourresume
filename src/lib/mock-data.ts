
import type { ResumeData } from "@/types";

export const mockResumeData: ResumeData = {
  personalInfo: {
    name: "Alex Doe",
    title: "Senior Software Engineer",
    email: "alex.doe@example.com",
    phone: "+1 (555) 123-4567",
    website: "alexdoe.dev",
    linkedin: "alexdoe",
    github: "alexdoe",
    summary:
      "Innovative Senior Software Engineer with over 8 years of experience in developing scalable web applications. Proficient in React, Node.js, and cloud technologies. Passionate about creating clean, efficient code and leading high-performing teams to deliver exceptional products.",
    template: "classic",
  },
  skills: [
    "JavaScript (ES6+)",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express.js",
    "Python",
    "GraphQL",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "Kubernetes",
    "AWS",
    "CI/CD",
    "Agile Methodologies",
  ],
  experience: [
    {
      id: "exp1",
      title: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2020",
      endDate: "Present",
      description:
        "Lead a team of 5 engineers in developing a new cloud-native SaaS platform. Architected and implemented a microservices-based backend using Node.js and TypeScript. Improved application performance by 30% through code optimization and database query tuning.",
    },
    {
      id: "exp2",
      title: "Software Engineer",
      company: "Innovate Co.",
      location: "Austin, TX",
      startDate: "Jun 2017",
      endDate: "Dec 2019",
      description:
        "Developed and maintained features for a large-scale e-commerce application using React and Redux. Collaborated with UX/UI designers to create responsive and user-friendly interfaces. Wrote comprehensive unit and integration tests, increasing code coverage to over 90%.",
    },
  ],
  education: [
    {
      id: "edu1",
      degree: "Master of Science in Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      startDate: "Sep 2015",
      endDate: "May 2017",
    },
    {
      id: "edu2",
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Texas at Austin",
      location: "Austin, TX",
      startDate: "Sep 2011",
      endDate: "May 2015",
    },
  ],
  projects: [
    {
      id: "proj1",
      name: "Real-time Chat Application",
      description:
        "A full-stack chat application featuring real-time messaging, user authentication, and multiple chat rooms, built with Socket.IO, React, and Express.",
      url: "github.com/alexdoe/chat-app",
      tags: ["React", "Node.js", "Socket.IO", "MongoDB"],
    },
  ],
  certifications: [
    {
      id: "cert1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "Mar 2021",
    },
  ],
  customSections: [],
  sectionOrder: ['skills', 'experience', 'education', 'projects', 'certifications'],
  layout: {
    sidebar: ['skills', 'education', 'certifications'],
    main: ['experience', 'projects'],
  }
};
