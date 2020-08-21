import React, { useEffect, useState } from 'react';
import axios from "axios";

import Loader from "./Loader";
import Paginate from "./Paginate"

const Giphy = () => {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexofFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexofFirstItem, indexOfLastItem);

    //page 1: item 1- item 25
    //page 2: item 26- item 50
    //page 3: item 51- item 75
    //page 4: item 76 - item 100
    
    useEffect(() => {
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);

            try {
                const results = await axios("https://api.giphy.com/v1/gifs/trending", {
                params: {
                    api_key: "3vWqGAMJBCTs0NRgW4RYeVEjgQYiCmqQ",
                    limit: 100
                }
             });
                console.log(results);
                setData(results.data.data);
            } catch  (err) {
                setIsError(true);
                setTimeout(() => setIsError(false), 4000);
            }

            
            setIsLoading(false);
        };
        fetchData();
    }, []);

    
   const renderGifs = () => {
       if(isLoading) {
          return <Loader />;
       }
       return currentItems.map(el => {
           return (

                    <div key={el.id} className="gif">
                        <img src={el.images.fixed_height.url} />
                    </div>
               
           )
       })
   }

   const renderError = () => {
      if(isError) {
        return(
            <div className="alert alert-danger alert-dismissable fade show" role="alert">
                Unable to get Gifs, please try again.
                <button className="close"></button>
            </div>
        )
      }
    }

    const handleSearchChange = e => {
        setSearch(e.target.value);
    };

    const handleFormSubmit = async e => {
        e.preventDefault();
        setIsError(false);
        setIsLoading(true);
        try {
            const results = await axios("https://api.giphy.com/v1/gifs/search", {
                params: {
                    api_key: "3vWqGAMJBCTs0NRgW4RYeVEjgQYiCmqQ",
                    q: search,
                    limit: 100
                }
            });
            setData(results.data.data); 
            
        } catch  (err) {
            setIsError(true);
            setTimeout(() => setIsError(false), 4000);
        }
        setIsLoading(false);
    };

    const pageSelected = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <div className="m-2">
            {renderError()}
            <form className="form-inline justify-content-center m-2">
                <input value={search} onChange={handleSearchChange} type="text" placeholder="Search" className="form-control"/>
                <button onClick={handleFormSubmit} type="submit" className="btn btn-primary mx-2">Go</button>
            </form>
            <Paginate 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            totalItems={data.length}
            pageSelected={pageSelected} 
            />
            <div className="container gifs">
                 {renderGifs()}
            </div>
        </div>
    );
   

}


export default Giphy;