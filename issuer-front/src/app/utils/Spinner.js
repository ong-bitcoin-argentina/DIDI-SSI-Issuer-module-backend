import React from "react";
import { ClipLoader } from "react-spinners";

const css = "z-index: 1; height: 100px; width: 100px; position: absolute; left: 50%; margin-left: -50px; top: 50%; margin-top: -50px;";

export default class Spinner {
	static render(loading) {
		return <ClipLoader css={css} size={100} loading={loading} />;
	}
}
