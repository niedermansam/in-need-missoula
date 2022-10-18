import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import OrganizationPage from "@/views/OrganizationListPage.vue";
import ResourceList from "@/views/ResourceListPage.vue";
import SearchPage from "@/views/SearchPage.vue";
import OrganizationDetails from "@/views/OrganizationDetailsPage.vue";
import ResourceDetails from "@/views/ResourceDetailsPage.vue";
import FavoritesPage from "@/views/FavoritesPage.vue";
import TagPage from "@/views/TagPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/organizations/:id",
    name: "org",
    component: OrganizationDetails,
  },
  {
    path: "/organizations/",
    name: "organizations",
    component: OrganizationPage,
  },
  {
    path: "/resources/",
    name: "resources",
    component: ResourceList,
  },
  {
    path: "/resource/:id",
    name: "resource-details",
    component: ResourceDetails,
  },
  {
    path: "/search/",
    name: "search",
    component: SearchPage,
  },
  {
    path: "/favorites/",
    name: "favorites",
    component: FavoritesPage,
  },
  {
    path: "/tag/:tag",
    name: "tag",
    component: TagPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
