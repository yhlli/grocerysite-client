import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../UserContext";
import { address } from "../Header";
import Grocery from "../Grocery";

import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

export default function GroceryPage(){
    const navigate = useNavigate();
    const {userInfo} = useContext(UserContext);
    const [groceryList, setGroceryList] = useState([]);
    const [groceryItem, setGroceryItem] = useState('');
    const [groceryQuantity, setGroceryQuantity] = useState(1);
    const storedTokens = localStorage.getItem('tokens');
    if (!storedTokens){
        navigate('/');
    }
    const {accessToken,refreshToken} = JSON.parse(storedTokens);

    useEffect(()=>{
        fetch(`${address}/${userInfo.id}/grocerylist`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-refresh-token': refreshToken
            },
            method: 'GET',
        }).then(response=>{response.json().then(
            grocery=>{
                setGroceryList(grocery);
            }
        )});
    },[]);

    const addGrocery = async (ev)=>{
        if (ev && typeof ev.preventDefault === 'function') {
            ev.preventDefault();
        }
        const data = new FormData();
        data.set('groceryItem', groceryItem);
        data.set('groceryQuantity', groceryQuantity);
        const response  = await fetch(`${address}/${userInfo.id}/grocerylist`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-refresh-token': refreshToken
            },
            method: 'POST',
            body: data,
        });
        if (response.ok){
            await fetch(`${address}/${userInfo.id}/grocerylist`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken
                },
                method: 'GET',
            }).then(response=>{response.json().then(
                grocery=>{
                    setGroceryList(grocery);
                }
            )});
        }
        setGroceryItem('');
        setGroceryQuantity(1);
    }

    const removeGrocery = async (ev)=>{
        const response = await fetch(`${address}/${userInfo.id}/grocerylist?item=${ev}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-refresh-token': refreshToken
            },
            method: 'DELETE',
        })
        if (response.ok) {
            await fetch(`${address}/${userInfo.id}/grocerylist`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken
                },
                method: 'GET',
            }).then(response => {
                response.json().then(
                    grocery => {
                        setGroceryList(grocery);
                    }
                )
            });
        }
    }

    const incrementGrocery = async (ev)=>{
        const num = 1;
        const response = await fetch(`${address}/${userInfo.id}/grocerylistquantity?num=${num}&name=${ev}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-refresh-token': refreshToken
            },
            method: 'PUT',
            body: ev,
        })
        if (response.ok) {
            await fetch(`${address}/${userInfo.id}/grocerylist`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken
                },
                method: 'GET',
            }).then(response => {
                response.json().then(
                    grocery => {
                        setGroceryList(grocery);
                    }
                )
            });
        }
    }

    const decrementGrocery = async (ev,quantity,id)=>{
        if (quantity== 1){
            removeGrocery(id);
            return;
        }
        const num = -1;
        const response = await fetch(`${address}/${userInfo.id}/grocerylistquantity?num=${num}&name=${ev}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-refresh-token': refreshToken
            },
            method: 'PUT',
        })
        if (response.ok) {
            await fetch(`${address}/${userInfo.id}/grocerylist`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken
                },
                method: 'GET',
            }).then(response => {
                response.json().then(
                    grocery => {
                        setGroceryList(grocery);
                    }
                )
            });
        }
    }

    const handleDragDrop = async (results)=>{
        const {source, destination, type} = results;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        if (type === 'group') {
            const groceryCopy = [...groceryList];
            const sIndex = source.index;
            const dIndex = destination.index;
            const [temp] = groceryCopy.splice(sIndex, 1);
            groceryCopy.splice(dIndex, 0, temp)
            setGroceryList(groceryCopy);
            await fetch(`${address}/${userInfo.id}/grocerylist`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken,
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(groceryCopy),
            })
        }
    }

    const check = async (ev)=>{
        const response = await fetch(`${address}/${userInfo.id}/grocerylistcheck?name=${ev}`, {
            headers :{
                'Authorization': `Bearer ${accessToken}`,
                'x-refresh-token': refreshToken,
                'Content-Type': 'application/json'
            },
            method: 'GET',    
        });
        const checked = await response.json();
        const res = await fetch(`${address}/${userInfo.id}/grocerylistcheck?name=${ev}`, {
            headers :{
                'Authorization': `Bearer ${accessToken}`,
                'x-refresh-token': refreshToken,
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
                isChecked: !checked,
            }),
        })
        if (res.ok) {
            await fetch(`${address}/${userInfo.id}/grocerylist`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken
                },
                method: 'GET',
            }).then(response => {
                response.json().then(
                    grocery => {
                        setGroceryList(grocery);
                    }
                )
            });
        }
    }

    return (
        <>
        {userInfo !== null && (
            <>
            <div>
                <h1>Grocery List</h1>
            </div>
            <form className="groceryForm" onSubmit={addGrocery}>
                <div className="input-container">
                    <input className="groceryText"
                        type="text"
                        placeholder="Grocery"
                        value={groceryItem}
                        required
                        onChange={ev => setGroceryItem(ev.target.value)} />
                    <input className="groceryQuantity"
                        type="number"
                        value={groceryQuantity}
                        onChange={ev => setGroceryQuantity(ev.target.value)}
                        min={1}
                        max={100}
                        required
                    />
                </div>
                <button id="grocerySubmit" style={{ marginTop: '5px' }}>Add Item</button>
            </form>
            <DragDropContext
                onDragEnd={handleDragDrop}
            >
                <Droppable droppableId="ROOT" type="group">
                    {(provided)=>(
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {groceryList.length > 0 && groceryList.map((grocery, index) => (
                                <Draggable draggableId={grocery._id} key={grocery._id} index={index}>
                                    {(provided)=>(
                                        <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                            <Grocery {...grocery} key={grocery._id}
                                                removeGrocery={removeGrocery}
                                                increment={incrementGrocery}
                                                decrement={decrementGrocery}
                                                check={check} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            </>
        )}
        </>
    );
}