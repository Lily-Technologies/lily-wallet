import React from "react";
import styled from "styled-components";

import { File } from "../types";

interface Props {
  accept: string;
  id: string;
  onFileLoad: (file: File) => void;
}

export const FileUploader = ({ accept, id, onFileLoad }: Props) => (
  <FileInput
    type="file"
    accept={accept}
    id={id}
    onChange={(e) => {
      if (e.target.files) {
        const filereader = new FileReader();
        const modifiedDate = e.target.files[0].lastModified;

        filereader.onload = (event) => {
          if (event.target && event.target.result) {
            onFileLoad({
              file: event.target.result.toString(),
              modifiedTime: modifiedDate,
            });
          }
        };
        filereader.readAsText(e.target.files[0]);
      }
    }}
  />
);

const FileInput = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
`;
