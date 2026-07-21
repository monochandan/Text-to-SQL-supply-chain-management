// import { View, Text } from 'react-native'
import React from 'react'
import "./Modal.css"
import {useState, useCallback} from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// const initialNodes = [
//   { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
//   { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
// ];
// const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];


function Modal() {
    const [modal, setModal] = useState(false);

     const tables = [
    {
        name: "customers",
        columns: ["customer_id(PK)", "customer_name", "location_id(FK)"]
    },
    {
        name: "customer_contacts",
        columns: ["customer_id(PK/FK)", "contact_type", "contact_info"]
    },
    {
        name: "locations",
        columns: ["location_id(PK)", "location_name", "location_state", "location_zip"]
    },
    {
        name: "inventory",
        columns: ["inventory_id(PK)", "inventory_name", "location_id(FK)"]
    },
    {
        name: "inventory_stocks",
        columns: ["inventory_id(FK)", "product_id(FK)", "quantity"]
    },
    {
        name: "products",
        columns: [
        "product_id(PK)",
        "product_name",
        "actual_price",
        "selling_price",
        "expiry_date",
        "total_quantity"
        ]
    },
    {
        name: "suppliers",
        columns: ["supplier_id(PK)", "supplier_name", "location_id(FK)"]
    },
    {
        name: "supplies",
        columns: ["supplier_id(PK/FK)", "product_id(PK/FK)"]
    },
    {
        name: "purchase_orders",
        columns: [
        "purchase_id(PK)",
        "supplier_id(FK)",
        "product_id(FK)",
        "purchase_quantity",
        "unit_price",
        "order_date",
        "delivery_date"
        ]
    },
    {
        name: "orders",
        columns: [
        "order_id(PK)",
        "inventory_id(FK)",
        "order_date",
        "product_id(FK)",
        "selling_price",
        "quantity_ordered"
        ]
    },
    {
        name: "customer_orders",
        columns: ["order_id(FK)", "customer_id(PK)"]
    },
    {
        name: "sales",
        columns: [
        "sale_id(PK)",
        "order_id(FK)",
        "product_id(FK)",
        "sale_quantity",
        "sale_amount",
        "profit_amount"
        ]
    },
    {
        name: "query_history",
        columns: ["id(PK)", "question", "sql_query", "created_at"]
    }
    ];

    const initialNodes = tables.map((table, index) => ({
        id: table.name,
        position: { x: 200 * (index % 3), y: 150 * Math.floor(index / 3) },
        data: {
            label: (
                <>
                    <b>{table.name}</b>
                    {table.columns.map((col) => (
                        <div key={col}>{col}</div>
                    ))}
                </>
            )
        }

    }))

    const initialEdges = [
  {
    id: "customers-locations",
    source: "customers",
    target: "locations",
    label: "location_id",
  },
  {
    id: "customer_contacts-customers",
    source: "customer_contacts",
    target: "customers",
    label: "customer_id",
  },
  {
    id: "inventory-locations",
    source: "inventory",
    target: "locations",
    label: "location_id",
  },
  {
    id: "suppliers-locations",
    source: "suppliers",
    target: "locations",
    label: "location_id",
  },
  {
    id: "supplies-suppliers",
    source: "supplies",
    target: "suppliers",
    label: "supplier_id",
  },
  {
    id: "supplies-products",
    source: "supplies",
    target: "products",
    label: "product_id",
  },
  {
    id: "purchase_orders-suppliers",
    source: "purchase_orders",
    target: "suppliers",
    label: "supplier_id",
  },
  {
    id: "purchase_orders-products",
    source: "purchase_orders",
    target: "products",
    label: "product_id",
  },
  {
    id: "inventory_stocks-inventory",
    source: "inventory_stocks",
    target: "inventory",
    label: "inventory_id",
  },
  {
    id: "inventory_stocks-products",
    source: "inventory_stocks",
    target: "products",
    label: "product_id",
  },
  {
    id: "orders-inventory",
    source: "orders",
    target: "inventory",
    label: "inventory_id",
  },
  {
    id: "orders-products",
    source: "orders",
    target: "products",
    label: "product_id",
  },
  {
    id: "customer_orders-orders",
    source: "customer_orders",
    target: "orders",
    label: "order_id",
  },
  {
    id: "customer_orders-customers",
    source: "customer_orders",
    target: "customers",
    label: "customer_id",
  },
  {
    id: "sales-orders",
    source: "sales",
    target: "orders",
    label: "order_id",
  },
  {
    id: "sales-products",
    source: "sales",
    target: "products",
    label: "product_id",
  },
];

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    // const tables = [
    //     "customers (customer_id, customer_name, location_id)",
    //     "customer_contacts (customer_id, contact_type, contact_info)",
    //     "locations (location_id, location_name, location_state, location_zip)",
    //     "inventory (inventory_id, inventory_name, location_id)",
    //     "inventory_stocks (inventory_id, product_id, quantity)",
    //     "products (product_id, product_name, actual_price, selling_price, expiry_date, total_quantity)",
    //     "suppliers (supplier_id, supplier_name, location_id)",
    //     "supplies (supplier_id, product_id)",
    //     "purchase_orders (purchase_id, supplier_id, product_id, purchase_quantity, unit_price, order_date, delivery_date)",
    //     "orders (order_id, inventory_id, order_date, product_id, selling_price, quantity_ordered)",
    //     "customer_orders (order_id, customer_id)",
    //     "sales (sale_id, order_id, product_id, sale_quantity, sale_amount, profit_amount)",
    //     "query_history (id, question, sql_query, created_at)",
    // ]

   
    const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );
    
    const toggleModal = () => {
        // when user click on the button, it will change the state of modal to its opposite value (true to false or false to true).
        // if it was open (modal = true), it will close it(modal = false), and if it was closed(modal = false), it will open it(modal = true).
        setModal(!modal); 
    }
  return (
    <>
        <button onClick={toggleModal} className="open-modal-button">
            Tables
        </button>

        {modal && (
            <div className="modal">
                <div onClick={toggleModal} className="overlay"></div>
                <div className="modal-content">
                    {/* <h2 className='modal-header'>Current available tables</h2> */}
                    {/* <h2 className='modal-header'>Current available tables</h2>
                    <ul className='modal-text'>
                        {tables.map((table, index) => (
    
                            <li key={index}>{table}<br/></li>
                        ))}
                        <span></span>
                    </ul> */}
                    <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                />
                 <button className="close-modal" onClick={toggleModal}>Close</button>
                </div>
               
            </div>
        )}
        {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. A ullam excepturi corrupti doloremque accusantium id ratione ipsa veniam eum magnam soluta molestias accusamus, maiores tenetur quae temporibus aperiam, sint expedita illum, libero error deserunt maxime omnis vero. Quis, iste. Dignissimos quidem repellat architecto expedita atque, nam fuga nihil maxime ducimus dolorem magnam in quae cum animi exercitationem et velit? Est vitae repellat, ratione, necessitatibus facilis veritatis, saepe tempore accusamus magni deleniti itaque aliquid rem! Ea laborum soluta et minima animi maiores unde aliquid modi quod quasi minus quae exercitationem earum pariatur iste, quisquam dolores magnam possimus sapiente excepturi nihil quibusdam, labore eius nam. Iure, repellendus! Voluptates eveniet, doloribus voluptatibus enim non rerum provident modi fuga possimus cumque quis. Ea laudantium eaque vitae, neque consequatur mollitia tempore numquam nam rerum amet porro aspernatur. Quam officiis sint atque placeat amet repudiandae corrupti totam ab vel perferendis cum dicta, sunt id autem tempore earum tenetur quas, blanditiis, dignissimos minima. Harum inventore, fuga placeat deleniti animi nulla repellat ducimus, ipsa eius mollitia magni atque sint, nesciunt deserunt iure quaerat? Doloremque earum culpa aliquid maiores. Quis odit, eius exercitationem et in praesentium obcaecati ex doloribus, nostrum dolorum totam harum, reprehenderit autem nobis vitae molestias explicabo. Id cupiditate dolore soluta, reiciendis unde doloremque perspiciatis nemo sapiente laudantium ratione impedit voluptatibus delectus, eligendi corrupti exercitationem, adipisci eum! Quae aliquid hic tempora consequatur, debitis exercitationem ut natus! A, corrupti aut. Eos tempore veniam sunt? Aliquam praesentium, unde illum laboriosam, facere numquam consectetur sint ducimus in neque distinctio fugit accusantium nisi cumque suscipit, rem beatae aliquid quas dolorum doloribus esse error ut dolores? Laboriosam neque ducimus vero nisi quos expedita error distinctio itaque accusantium. Accusantium architecto ab maiores facilis est? Perferendis obcaecati aliquid eaque, vitae nam minus officia</p> */}
    </>
  )
}

export default Modal