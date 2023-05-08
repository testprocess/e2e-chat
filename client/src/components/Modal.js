import React, { useEffect, useState } from "react";

function ModalButton(props) {
    return (
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target={"#"+props.id}>
            {props.title}
        </button>
    )
}

function Modal(props) {
    

    return (
        <div>

            <div class="modal fade" id={props.id} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
  
export { Modal, ModalButton };