import React from 'react';
import styled from 'styled-components';

export const FileUploader = ({ accept, id, onFileLoad }) => (
  <FileInput
    type="file"
    accept={accept}
    id={id}
    onChange={(e) => {
      const filereader = new FileReader();
      const modifiedDate = e.target.files[0].lastModified;

      filereader.onload = (event) => {
        onFileLoad({ file: event.target.result, modifiedTime: modifiedDate })
      };

      filereader.readAsText(e.target.files[0]);
    }}
  />
)

const FileInput = styled.input`
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
`;