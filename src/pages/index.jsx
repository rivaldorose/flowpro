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

            {/* NEW v2.0 Routes with AppLayout (Horizontal Navbar) */}
            <Route path="/templates" element={
                <AppLayout>
                    <Templates />
                </AppLayout>
            } />
            <Route path="/dashboard" element={
                <AppLayout>
                    <Dashboard />
                </AppLayout>
            } />
            <Route path="/projects" element={
                <AppLayout>
                    <Projects />
                </AppLayout>
            } />
            <Route path="/project/:id" element={<ProjectLayout />} />
            
            {/* Template pages without Layout (they have their own full-screen layout) */}
            <Route path="/ShortFilmTemplate" element={<ShortFilmTemplate />} />
            <Route path="/templates/short-film" element={<ShortFilmTemplate />} />
            <Route path="/MusicVideoTemplate" element={<MusicVideoTemplate />} />
            <Route path="/templates/music-video" element={<MusicVideoTemplate />} />
            <Route path="/CommercialProductionTemplate" element={<CommercialProductionTemplate />} />
            <Route path="/templates/commercial" element={<CommercialProductionTemplate />} />
            <Route path="/PodcastProductionTemplate" element={<PodcastProductionTemplate />} />
            <Route path="/templates/podcast" element={<PodcastProductionTemplate />} />
            <Route path="/BlankCanvasTemplate" element={<BlankCanvasTemplate />} />
            <Route path="/templates/blank" element={<BlankCanvasTemplate />} />
            <Route path="/PhotoshootProductionTemplate" element={<PhotoshootProductionTemplate />} />
            <Route path="/templates/photoshoot" element={<PhotoshootProductionTemplate />} />
            <Route path="/DocumentaryTemplate" element={<DocumentaryTemplate />} />
            <Route path="/templates/documentary" element={<DocumentaryTemplate />} />
            
            {/* OLD Routes with Legacy Layout (backwards compatible) */}
            <Route path="*" element={
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