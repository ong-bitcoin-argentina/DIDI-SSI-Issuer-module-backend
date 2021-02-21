import { Chip } from "@material-ui/core";
import React from "react";

const CustomChip = ({ title }) => <Chip style={{ fontSize: "12px", margin: "4px 5px 4px 2px" }} label={title} />;

export default CustomChip;
