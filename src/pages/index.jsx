import AppLayout from "../components/layout/AppLayout";

import Dashboard from "./Dashboard";

import Templates from "./Templates";

import ProjectLayout from "./project/ProjectLayout";

import Settings from "./Settings";

import SignIn from "./SignIn";

import SignUp from "./SignUp";

import ForgotPassword from "./ForgotPassword";

import ProfileSetup from "../components/auth/ProfileSetup";
import ProfileGuard from "../components/auth/ProfileGuard";

import ShortFilmTemplate from "./ShortFilmTemplate";

import MusicVideoTemplate from "./MusicVideoTemplate";

import CommercialProductionTemplate from "./CommercialProductionTemplate";

import PodcastProductionTemplate from "./PodcastProductionTemplate";

import BlankCanvasTemplate from "./BlankCanvasTemplate";

import PhotoshootProductionTemplate from "./PhotoshootProductionTemplate";

import DocumentaryTemplate from "./DocumentaryTemplate";

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    return (
        <Routes>
            {/* Auth pages without Layout */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />

            {/* NEW v2.0 Routes with AppLayout (Horizontal Navbar) - Protected by ProfileGuard */}
            <Route path="/" element={
                <ProfileGuard>
                    <Navigate to="/dashboard" replace />
                </ProfileGuard>
            } />
            <Route path="/templates" element={
                <ProfileGuard>
                    <AppLayout>
                        <Templates />
                    </AppLayout>
                </ProfileGuard>
            } />
            <Route path="/dashboard" element={
                <ProfileGuard>
                    <AppLayout>
                        <Dashboard />
                    </AppLayout>
                </ProfileGuard>
            } />
            {/* Redirect /projects to /dashboard */}
            <Route path="/projects" element={
                <ProfileGuard>
                    <Navigate to="/dashboard" replace />
                </ProfileGuard>
            } />
            <Route path="/project/:id" element={
                <ProfileGuard>
                    <ProjectLayout />
                </ProfileGuard>
            } />
            
            {/* Template pages without Layout (they have their own full-screen layout) - Protected by ProfileGuard */}
            <Route path="/ShortFilmTemplate" element={<ProfileGuard><ShortFilmTemplate /></ProfileGuard>} />
            <Route path="/templates/short-film" element={<ProfileGuard><ShortFilmTemplate /></ProfileGuard>} />
            <Route path="/MusicVideoTemplate" element={<ProfileGuard><MusicVideoTemplate /></ProfileGuard>} />
            <Route path="/templates/music-video" element={<ProfileGuard><MusicVideoTemplate /></ProfileGuard>} />
            <Route path="/CommercialProductionTemplate" element={<ProfileGuard><CommercialProductionTemplate /></ProfileGuard>} />
            <Route path="/templates/commercial" element={<ProfileGuard><CommercialProductionTemplate /></ProfileGuard>} />
            <Route path="/PodcastProductionTemplate" element={<ProfileGuard><PodcastProductionTemplate /></ProfileGuard>} />
            <Route path="/templates/podcast" element={<ProfileGuard><PodcastProductionTemplate /></ProfileGuard>} />
            <Route path="/BlankCanvasTemplate" element={<ProfileGuard><BlankCanvasTemplate /></ProfileGuard>} />
            <Route path="/templates/blank" element={<ProfileGuard><BlankCanvasTemplate /></ProfileGuard>} />
            <Route path="/PhotoshootProductionTemplate" element={<ProfileGuard><PhotoshootProductionTemplate /></ProfileGuard>} />
            <Route path="/templates/photoshoot" element={<ProfileGuard><PhotoshootProductionTemplate /></ProfileGuard>} />
            <Route path="/DocumentaryTemplate" element={<ProfileGuard><DocumentaryTemplate /></ProfileGuard>} />
            <Route path="/templates/documentary" element={<ProfileGuard><DocumentaryTemplate /></ProfileGuard>} />
            
            {/* Settings routes */}
            <Route path="/settings" element={
                <ProfileGuard>
                    <AppLayout>
                        <Settings />
                    </AppLayout>
                </ProfileGuard>
            } />
            <Route path="/settings/team" element={
                <ProfileGuard>
                    <AppLayout>
                        <Settings />
                    </AppLayout>
                </ProfileGuard>
            } />
            <Route path="/settings/equipment" element={
                <ProfileGuard>
                    <AppLayout>
                        <Settings />
                    </AppLayout>
                </ProfileGuard>
            } />
            <Route path="/settings/organizations" element={
                <ProfileGuard>
                    <AppLayout>
                        <Settings />
                    </AppLayout>
                </ProfileGuard>
            } />
            <Route path="/settings/contacts" element={
                <ProfileGuard>
                    <AppLayout>
                        <Settings />
                    </AppLayout>
                </ProfileGuard>
            } />
            
            {/* Redirect all old routes to dashboard */}
            <Route path="/Dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/Projects" element={<Navigate to="/dashboard" replace />} />
            <Route path="/Businesses" element={<Navigate to="/settings/organizations" replace />} />
            <Route path="/Crew" element={<Navigate to="/dashboard" replace />} />
            <Route path="/Schedule" element={<Navigate to="/dashboard" replace />} />
            <Route path="/Scripts" element={<Navigate to="/dashboard" replace />} />
            <Route path="/Budget" element={<Navigate to="/dashboard" replace />} />
            <Route path="/ProjectDetail" element={<Navigate to="/dashboard" replace />} />
            <Route path="/ScriptDetail" element={<Navigate to="/dashboard" replace />} />
            <Route path="/Shots" element={<Navigate to="/dashboard" replace />} />
            <Route path="/PostProduction" element={<Navigate to="/dashboard" replace />} />
            <Route path="/Locations" element={<Navigate to="/dashboard" replace />} />
            <Route path="/Team" element={<Navigate to="/settings/team" replace />} />
            <Route path="/Profile" element={<Navigate to="/settings" replace />} />
            <Route path="/Tasks" element={<Navigate to="/dashboard" replace />} />
            <Route path="/Podcasts" element={<Navigate to="/dashboard" replace />} />
            <Route path="/PodcastDetail" element={<Navigate to="/dashboard" replace />} />
            <Route path="/Storyboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/ProductionPlanning" element={<Navigate to="/dashboard" replace />} />
            <Route path="/TeamMembers" element={<Navigate to="/settings/team" replace />} />
            <Route path="/Equipment" element={<Navigate to="/settings/equipment" replace />} />
            <Route path="/ProductionPlanning/Equipment" element={<Navigate to="/settings/equipment" replace />} />
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={
                <ProfileGuard>
                    <Navigate to="/dashboard" replace />
                </ProfileGuard>
            } />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}