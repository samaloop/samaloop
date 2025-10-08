import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorProps {
    editorData: string;
    onChange: (data: any) => void;
}

const MyCKEditor: React.FC<CKEditorProps> = ({ editorData, onChange }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            onChange={(event: any, editor: any) => {
                onChange(editor.getData())
            }}
        />
    );
};

export default MyCKEditor;
