import {
    createRouter,
    createRootRoute,
    createRoute,
    Outlet,
    redirect,
} from "@tanstack/react-router";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import OwnerSignup from "../pages/OwnerSignup";
import Dashboard from "../pages/Dashboard";
import FeedbackForm from "../pages/FeedbackForm";
import FeedbackList from "../pages/FeedbackList";
import SettingsPage from "../pages/SettingsPage";
import Analytics from "../pages/Analytics";
import Team from "../pages/Team";
import IntegrationsDocs from "../pages/IntegrationsDocs";

const auth = {
    isAuthenticated: () => !!localStorage.getItem("access_token"),
};

/* ---------- ROOT ---------- */
const rootRoute = createRootRoute({
    component: () => <Outlet />,
});

const landingPageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: LandingPage,
});


/* ---------- LOGIN ---------- */

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login,
});

/* ---------- OWNER SIGNUP ---------- */
const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/signup",
    component: OwnerSignup,
});

const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    beforeLoad: () => {
        if (!auth.isAuthenticated()) {
            throw redirect({ to: "/login" });
        }
    },
    component: Dashboard,
});

const feedbackFormRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/feedback-form",
    validateSearch: (search) => ({
        company_id: search.company_id,
    }),
    component: FeedbackForm,
});

const feedbackListRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/feedback-list",
    beforeLoad: () => {
        if (!auth.isAuthenticated()) {
            throw redirect({ to: "/login" });
        }
    },
    component: FeedbackList,
});

const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/settings",
    beforeLoad: () => {
        if (!auth.isAuthenticated()) {
            throw redirect({ to: "/login" });
        }
    },
    component: SettingsPage,
});

const analyticsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/analytics",
    beforeLoad: () => {
        if (!auth.isAuthenticated()) {
            throw redirect({ to: "/login" });
        }
    },
    component: Analytics,
});

const teamRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/team",
    beforeLoad: () => {
        if (!auth.isAuthenticated()) {
            throw redirect({ to: "/login" });
        }
    },
    component: Team,
});

const integrationsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/integrations",
    beforeLoad: () => {
        if (!auth.isAuthenticated()) {
            throw redirect({ to: "/login" });
        }
    },
    component: IntegrationsDocs,
});

/* ---------- ROUTER ---------- */
const routeTree = rootRoute.addChildren([
    landingPageRoute,
    loginRoute,
    signupRoute,
    dashboardRoute,
    feedbackFormRoute,
    feedbackListRoute,
    analyticsRoute,
    teamRoute,
    integrationsRoute,
    settingsRoute,
]);

const AppRouter = createRouter({ routeTree });

export default AppRouter;
