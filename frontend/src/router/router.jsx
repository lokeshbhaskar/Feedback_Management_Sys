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

const auth = {
    isAuthenticated: () => !!localStorage.getItem("token"),
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

/* ---------- DASHBOARD (PROTECTED) ---------- */
const Dashboard = () => <div>Dashboard (Protected)</div>;

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

/* ---------- ROUTER ---------- */
const routeTree = rootRoute.addChildren([
    landingPageRoute,
    loginRoute,
    signupRoute,
    dashboardRoute,
]);

const AppRouter = createRouter({ routeTree });

export default AppRouter;
