import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from "react-router-dom";
import React from "react";

type LinkProps = ReactRouterLinkProps;

const Link: React.FC<LinkProps> = ({ children, to, ...props }) => {
  // Tailor the following test to your environment.
  // This example assumes that any internal link (intended for React)
  // will start with exactly one slash, and that anything else is external.
  const internal = typeof to === "string" ? /^\/(?!\/)/.test(to) : true;

  // Use React Router Link for internal links, and <a> for others
  if (internal || typeof to !== "string") {
    return (
      <ReactRouterLink to={to} {...props}>
        {children}
      </ReactRouterLink>
    );
  }

  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
};

export default Link;
