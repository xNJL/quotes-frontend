import {useEffect, useState} from "react";
import Service from "../types/service";
import Quote from "../types/quote";

export interface QuoteServiceProps {
    filterText: string;
}

export interface Quotes {
    results: Quote[];
}

const useQuoteService = ({filterText}: QuoteServiceProps) => {
    const [rows, setRows] = useState<Service<Quote[]>>({status: 'loading'})

    useEffect(() => {
        const queryUrl = filterText !== undefined && filterText.length > 0 ? '/quotes/'.concat(filterText) :  '/quotes'
        setRows({status: 'loading'})
        fetch(queryUrl)
            .then(response => response.json())
            .then(response => {setRows({status: 'loaded', payload: response.quotes})})
            .catch(error => setRows({status: 'error', error: error}));
    }, [filterText])
    console.log(rows)
    return(rows)
};

export default useQuoteService;