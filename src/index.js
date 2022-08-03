import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import CreateAccount from "./components/Accounts/createAccount";
import HandleAccounts from "./components/Accounts/handleAccounts";
import Home from "./components/Home/Home";
import Dashboard from './components/Dashboard/Dashboard';
import Preferences from './components/Preferences/Preferences';
import Upload from './components/Upload/Upload';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from "./components/Login/Login";
import Contact from "./components/Contact/Contact";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Tournament from './components/Tournament/Tournament';
import TeamRosters from './components/TeamRosters/TeamRosters';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Tournaments from './components/Tournaments/Tournaments';
import Round from './components/Round/Round'
import Schedule from './components/Schedule/Schedule'
import RequireLogin from './components/RequireLogin/RequireLogin'
import SessionExpired from './components/RequireLogin/SessionExpired'
import TeamOverview from './components/TeamOverview/TeamOverview'
import EditTeam from './components/TeamOverview/EditTeam';
import Team from './components/Team/Team'
import DeletedTournaments from './components/Tournaments/DeletedTournaments'
import ScoreMatch from './components/Score/ScoreMatch'
import ScoreOverview from './components/Score/ScoreOverview'
import InvalidRole from "./components/InvalidRole/InvalidRole";
import EditAccount from "./components/Accounts/editAccount";
import EditJudges from "./components/Schedule/EditJudges";
import AccountDeleted from "./components/RequireLogin/AccountDeleted"
// The routes are nested under <App /> so that header/footer are consistent across site
document.title = "IBF Scheduler"
ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter forceRefresh={true}>
            <Header />
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/home" element={<Home />} />
                <Route path="/create_account" element={<CreateAccount />} />
                <Route path="/manage_accounts" element={<HandleAccounts />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/preferences" element={<Preferences />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/schedule/teamRoster" element={<TeamRosters />} />
                <Route path="/forgot_password" element={<ForgotPassword />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/tournament" element={<Tournament />} />
                <Route path="/round" element={<Round />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/require_login" element={<RequireLogin />} />
                <Route path="/invalid_access" element={<InvalidRole />} />
                <Route path="/expired" element={<SessionExpired />} />
                <Route path="/teamoverview" element={<TeamOverview />} />
                <Route path="/team" element={<Team />} />
                <Route path="/scorematch" element={<ScoreMatch />} />
                <Route path="/scoreoverview" element={<ScoreOverview />} />
                <Route path="/deleted_tournaments" element={<DeletedTournaments />} />
                <Route path="/edit_account" element={<EditAccount />}/>
                <Route path="/edit_judges" element={<EditJudges />}/>
                <Route path="/editTeam" element={<EditTeam />}/>
                <Route path="/account_deleted" element={<AccountDeleted />}/>
                <Route
                    path="*"
                    element={
                        <main style={{ padding: "1rem" }}>
                            <p style={{ color: "white" }}>No page found!</p>
                        </main>
                    } />
            </Routes >
            <Footer />
        </BrowserRouter >
    </React.StrictMode >,
    document.getElementById('root'));
registerServiceWorker();