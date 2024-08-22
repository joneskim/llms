// src/components/AssignmentList.js
import * as React from 'react';
import { List, Datagrid, TextField, DateField } from 'react-admin';

export const AssignmentList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="due_date" />
        </Datagrid>
    </List>
);
