import {
    createRouter,
    createRootRoute,
    createRoute,
    Outlet,
    redirect,
} from "@tanstack/react-router";
import LandingPage from "../pages/LandingPage";

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
const Login = () => <div>Login Page</div>;

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login,
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
    dashboardRoute,
]);

const AppRouter = createRouter({ routeTree });

export default AppRouter;
