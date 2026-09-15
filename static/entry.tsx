import React from "react";
import {hydrateRoot} from "react-dom/client";
import SiteClient from "../app/site-client";
import "../app/globals.css";
const props=JSON.parse(document.getElementById("site-props")!.textContent!);
hydrateRoot(document.getElementById("root")!,<SiteClient {...props}/>);
