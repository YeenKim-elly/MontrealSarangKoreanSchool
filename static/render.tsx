import React from "react";
import {renderToString} from "react-dom/server";
import SiteClient from "../app/site-client";
import {normalizeContent} from "../lib/site-content";
import content from "./content.json";
import gallery from "./gallery.json";
export const data={...normalizeContent(content),gallery:gallery.photos};
export function render(props:any){return renderToString(<SiteClient {...props}/>)}
