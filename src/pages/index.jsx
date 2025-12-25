import Layout from "./Layout.jsx";
import AppLayout from "../components/layout/AppLayout";

import Dashboard from "./Dashboard";

import Projects from "./Projects";

import Templates from "./Templates";

import ProjectLayout from "./project/ProjectLayout";

import Businesses from "./Businesses";

import Crew from "./Crew";

import Schedule from "./Schedule";

import Scripts from "./Scripts";

import Budget from "./Budget";

import ProjectDetail from "./ProjectDetail";

import ScriptDetail from "./ScriptDetail";

import Shots from "./Shots";

import PostProduction from "./PostProduction";

import Locations from "./Locations";

import Team from "./Team";

import Profile from "./Profile";
import Settings from "./Settings";

import Tasks from "./Tasks";

import Podcasts from "./Podcasts";

import PodcastDetail from "./PodcastDetail";

import Storyboard from "./Storyboard";

import ProductionPlanning from "./ProductionPlanning";

import TeamMembers from "./TeamMembers";

import Equipment from "./Equipment";

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

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Projects: Projects,
    
    Businesses: Businesses,
    
    Crew: Crew,
    
    Schedule: Schedule,
    
    Scripts: Scripts,
    
    Budget: Budget,
    
    ProjectDetail: ProjectDetail,
    
    ScriptDetail: ScriptDetail,
    
    Shots: Shots,
    
    PostProduction: PostProduction,
    
    Locations: Locations,
    
    Team: Team,
    
    Profile: Profile,
    
    Tasks: Tasks,
    
    Podcasts: Podcasts,
    
    PodcastDetail: PodcastDetail,
    
    Storyboard: Storyboard,
    
    ProductionPlanning: ProductionPlanning,
    
    TeamMembers: TeamMembers,
    
    Equipment: Equipment,
    
    SignIn: SignIn,
    
    SignUp: SignUp,
    
    ForgotPassword: ForgotPassword,
    
    ShortFilmTemplate: ShortFilmTemplate,
    
    MusicVideoTemplate: MusicVideoTemplate,
    
    CommercialProductionTemplate: CommercialProductionTemplate,
    
    PodcastProductionTemplate: PodcastProductionTemplate,
    
    BlankCanvasTemplate: BlankCanvasTemplate,
    
    PhotoshootProductionTemplate: PhotoshootProductionTemplate,
    
    DocumentaryTemplate: DocumentaryTemplate,
    
    Templates: Templates,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    const isAuthPage = location.pathname === '/signin' || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password' || location.pathname === '/forgotpassword';
    
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
            
            {/* OLD Routes with Legacy Layout (backwards compatible) - Protected by ProfileGuard */}
            <Route path="*" element={
                <ProfileGuard>
                    <Layout currentPageName={currentPage}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/Dashboard" element={<Dashboard />} />
                            <Route path="/Projects" element={<Projects />} />
                        <Route path="/Businesses" element={<Businesses />} />
                        <Route path="/Crew" element={<Crew />} />
                        <Route path="/Schedule" element={<Schedule />} />
                        <Route path="/Scripts" element={<Scripts />} />
                        <Route path="/Budget" element={<Budget />} />
                        <Route path="/ProjectDetail" element={<ProjectDetail />} />
                        <Route path="/ScriptDetail" element={<ScriptDetail />} />
                        <Route path="/Shots" element={<Shots />} />
                        <Route path="/PostProduction" element={<PostProduction />} />
                        <Route path="/Locations" element={<Locations />} />
                        <Route path="/Team" element={<Team />} />
                        <Route path="/Profile" element={<Profile />} />
                        <Route path="/Tasks" element={<Tasks />} />
                        <Route path="/Podcasts" element={<Podcasts />} />
                        <Route path="/PodcastDetail" element={<PodcastDetail />} />
                        <Route path="/Storyboard" element={<Storyboard />} />
                        <Route path="/ProductionPlanning" element={<ProductionPlanning />} />
                        <Route path="/TeamMembers" element={<TeamMembers />} />
                        <Route path="/settings/team" element={<TeamMembers />} />
                        <Route path="/Equipment" element={<Equipment />} />
                        <Route path="/ProductionPlanning/Equipment" element={<Equipment />} />
                        </Routes>
                    </Layout>
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