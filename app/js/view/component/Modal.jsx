import React, { Component } from "react";
import { createPortal } from "react-dom";

const body = document.body;

export function Modal({ isOpen, onClose, className, children, ...rest }) {
  const classes = ["m-auto w-full lg:w-4/5 max-w-4xl bg-white p-4"];
  if (className) classes.push(className);

  return isOpen ? (
    <Portal>
      {/*
        Marking an element with the role presentation indicates to assistive technology
        that this element should be ignored; it exists to support the web application and
        is not meant for humans to interact with directly.
        https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
      */}
      <div
        role="presentation"
        className="modal"
        onKeyDown={handleKeyDown}
        onClick={closeModal}
      >
        <div
          className={classes.join(" ")}
          {...rest}
        >
          {children}
        </div>
      </div>
    </Portal>
  ) : null;

  // ***************************************

  // eslint-disable-next-line no-unused-vars
  function closeModal(ev) {
    if (ev.target === ev.currentTarget)
      onClose();
  }

  function handleKeyDown(ev) {
    // Ignore events that have been `event.preventDefault()` marked.
    // preventDefault() is meant to stop default behaviours like
    // clicking a checkbox to check it, hitting a button to submit a form,
    // and hitting left arrow to move the cursor in a text input etc.
    // Only special HTML elements have these default bahaviours.
    //
    // To remove in v4.
    if (ev.key !== "Escape" || ev.defaultPrevented) {
      return;
    }

    // Swallow the event, in case someone is listening for the escape key on the body.
    ev.stopPropagation();

    // if (this.props.onEscapeKeyDown) {
    //   this.props.onEscapeKeyDown(ev);
    // }

    if (onClose && ev.target === ev.currentTarget) {
      onClose(ev, "escapeKeyDown");
    }
  }
}

export class Portal extends Component {
  constructor() {
    super();
    // 1: Create a new div that wraps the component
    this.el = document.createElement("div");
  }
  // 2: Append the element to the DOM when it mounts
  componentDidMount() {
    body.style.overflowY = "hidden";
    body.appendChild(this.el);
  }
  // 3: Remove the element when it unmounts
  componentWillUnmount() {
    body.style.overflowY = "";
    body.removeChild(this.el);
  }
  render() {
    // 4: Render the element's children in a Portal
    const { children } = this.props;
    return createPortal(children, this.el);
  }
}
