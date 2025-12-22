export type Persona = 'individual' | 'company';


export interface Iuser {
    id: string;
    name: string;      // e.g., "محمد علي"
    email: string;     // e.g., "user@example.com"
    photoUrl?: string; // URL for the profile image
    role: 'فرد' | 'شركة' | 'محاسب'; // Matches the "فرد" label in your image
    isLoggedIn: boolean;
}
export interface profile {
    id?: string;               // Optional unique identifier from the database
    name: string;             // User's full name
    email: string;            // User's email address
    password?: string;        // Used during registration/login
    persona: Persona;        // Type of account: individual or company
    joinedDate?: string;      // "Member since" date displayed on the profile
    avatarUrl?: string;       // URL for the profile picture
    termsAccepted?: boolean;  // Verification for registration
}
