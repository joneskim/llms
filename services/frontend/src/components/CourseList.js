// src/components/CourseList.js
import * as React from 'react';
import { List, Datagrid, TextField, DateField } from 'react-admin';

export const CourseList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <DateField source="created_at" />
        </Datagrid>
    </List>
);
