// import  React from 'react';
// import Box from '@mui/material/Box';
// import {
//   DataGridPremium,
//   GridToolbar,
//   useGridApiRef,
//   useKeepGroupedColumnsHidden,
// } from '@mui/x-data-grid-premium';
// import { useDemoData } from '@mui/x-data-grid-generator';

// const visibleFields = [
//   'commodity',
//   'quantity',
//   'filledQuantity',
//   'status',
//   'isFilled',
//   'unitPrice',
//   'unitPriceCurrency',
//   'subTotal',
//   'feeRate',
//   'feeAmount',
//   'incoTerm',
// ];

// export default function Home() {
//   const { data, loading } = useDemoData({
//     dataSet: 'Commodity',
//     rowLength: 100,
//     editable: true,
//     visibleFields,
//   });
//   const apiRef = useGridApiRef();

//   const initialState = useKeepGroupedColumnsHidden({
//     apiRef,
//     initialState: {
//       ...data.initialState,
//       rowGrouping: {
//         ...data.initialState?.rowGrouping,
//         model: ['commodity'],
//       },
//       sorting: {
//         sortModel: [{ field: '__row_group_by_columns_group__', sort: 'asc' }],
//       },
//       aggregation: {
//         model: {
//           quantity: 'sum',
//         },
//       },
//     },
//   });

//   return (
//     <div>
//             <h1> Home </h1>
//     <Box sx={{ height: 520, width: '100%' }}>
//       <DataGridPremium
//         {...data}
//         apiRef={apiRef}
//         loading={loading}
//         disableRowSelectionOnClick
//         initialState={initialState}
//         slots={{ toolbar: GridToolbar }}
//       />
//     </Box>
//     </div>
//   );
// }


import React from "react";

export default function Home() {
    return (
        <div>
            <div> Home </div>
        </div>
    )
}