export interface PersonalInfo {
  fullName: string
  contactNumber: string
  email: string
  address: string  // Make it required in the type, but it can be empty string
}

export interface Education {
  school: string
  degree: string
  year: string
}

export interface Skill {
  technical: string[]
  other: string[]
}

export interface WorkExperience {
  jobTitle: string
  company: string
  dates: string
  responsibilities: string
}

export interface Project {
  name: string
  description: string
}

export interface Certification {
  name: string
  issuer: string
  year: string
}

export interface Achievement {
  title: string
  description: string
  year: string
}

export interface Reference {
  name: string
  position: string
  contact: string
}

// Form data type (with string fields before transformation)
export interface CVFormData {
  personalInfo: PersonalInfo
  objective: string
  education: Education[]
  skills: {
    technical: string  // This is a string in the form (comma-separated)
    other: string      // This is a string in the form (comma-separated)
  }
  workExperience: WorkExperience[]
  projects: Project[]
  certifications: Certification[]
  achievements: Achievement[]
  referees: Reference[]
}

// Database type (with transformed arrays)
export interface CVDatabaseData {
  personalInfo: PersonalInfo
  objective: string
  education: Education[]
  skills: Skill  // This has string arrays
  workExperience: WorkExperience[]
  projects: Project[]
  certifications: Certification[]
  achievements: Achievement[]
  referees: Reference[]
}