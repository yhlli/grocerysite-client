import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../UserContext";
import { address } from "../Header";
import Grocery from "../Grocery";
import Category from "../Category";

import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

export default function GroceryPage(){
    const {userInfo} = useContext(UserContext);
    const [groceryList, setGroceryList] = useState([]);
    const [groceryItem, setGroceryItem] = useState('');
    const [groceryQuantity, setGroceryQuantity] = useState(1);
    const storedTokens = localStorage.getItem('tokens');
    const {accessToken,refreshToken} = JSON.parse(storedTokens);
    const [categoryList, setCategoryList] = useState([]);
    const [categoryItem, setCategoryItem] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        const storedTokens = localStorage.getItem('tokens');
        const {accessToken,refreshToken} = JSON.parse(storedTokens);
        /* fetch(`${address}/${userInfo.id}/categorylist`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-refresh-token': refreshToken
            },
            method: 'GET',
        }).then(response=>{response.json().then(
            category=>{
                setCategoryList(category);
            }
        )}); */
        const fetchCategory = async()=>{
            const response = await fetch(`${address}/${userInfo.id}/categorylist`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken
                },
                method: 'GET',
            });
            if (response.ok){
                const category = await response.json();
                setCategoryList(category);
            }
        }
        const fetchGrocery = async()=>{
            const response = await fetch(`${address}/${userInfo.id}/grocerylist`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken
                },
                method: 'GET',
            });
            if (response.ok){
                const grocery = await response.json();
                setGroceryList(grocery);
            }
        }
        /* fetch(`${address}/${userInfo.id}/grocerylist`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-refresh-token': refreshToken
            },
            method: 'GET',
        }).then(response=>{response.json().then(
            grocery=>{
                setGroceryList(grocery);
            }
        )}); */
        fetchCategory();
        fetchGrocery();
        setIsLoading(false);
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

    const addCategory = async (ev)=>{
        if (ev && typeof ev.preventDefault === 'function'){
            ev.preventDefault();
        }
        const data = new FormData();
        data.set('categoryItem', categoryItem);
        const response  = await fetch(`${address}/${userInfo.id}/categorylist`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-refresh-token': refreshToken
            },
            method: 'POST',
            body: data,
        });
        if (response.ok){
            await fetch(`${address}/${userInfo.id}/categorylist`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken
                },
                method: 'GET',
            }).then(response=>{response.json().then(
                category=>{
                    setCategoryList(category);
                    console.log(typeof(category) + 'testttttt')
                }
            )});
        }
        setCategoryItem('');
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

    return (
        <>
        {isLoading ? (
            <p>Loading</p>
        ) : (
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
                    <button id="grocerySubmit" style={{ marginTop: '5px' }}>Add Grocery</button>
                </form>
                <form className="groceryForm" onSubmit={addCategory}>
                    <div className="input-container">
                        <input className="groceryText"
                            type="text"
                            placeholder="Category"
                            value={categoryItem}
                            required
                            onChange={ev => setCategoryItem(ev.target.value)} />
                    </div>
                    <button id="grocerySubmit" style={{ marginTop: '5px' }}>Add Category</button>
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
                                                    decrement={decrementGrocery} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {/* {Array.isArray(categoryList) > 0 && ( */}
                                    <>
                                    {categoryList.length}
                                    {categoryList.length > 0 && categoryList.map((category, index) =>(
                                        <>
                                        <p>test</p>
                                        <Draggable draggableId={category._id} key={category._id} index={index}>
                                            {(provided)=>(
                                                <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                    <Category {...category} key={category._id}
                                                        
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                        </>
                                    ))}
                                    </>
                                {/* )} */}
                                
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                </>
            )}
            </>
        )}
        </>
    );
}