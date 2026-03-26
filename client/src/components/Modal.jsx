import React from "react";
import { AddGame } from "./AddGame";

export const Modal = ({ onGameAdded }) => {
  const [canSubmit, setCanSubmit] = React.useState(false);

  return (
    <div
      className="modal fade"
      id="addGameModal"
      tabIndex="-1"
      aria-labelledby="addGameModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addGameModalLabel">
              Add a New Game
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <AddGame onGameAdded={onGameAdded} setCanSubmit={setCanSubmit} />
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-success"
              form="addGameForm"
              disabled={!canSubmit}
            >
              Add Game
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
