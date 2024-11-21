import { useState } from 'react';
import { Document, Page } from 'react-pdf';
export default function ResumePage(){

    const [numPages, setNumPages] = useState(null);
    const onDocumentLoadSuccess = ({numPages}) =>{
        setNumPages(numPages);
    };

    return(
        <>
            <Document file="../public/Resume.pdf" onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={1} />
            </Document>
            <object data="../public/Resume.pdf" type=""></object>
        </>
    );
}