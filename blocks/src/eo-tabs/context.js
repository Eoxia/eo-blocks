import { createContext } from '@wordpress/element';

const globalContext = window.EO_TABS_CONTEXT || createContext({
    activeTab: 0,
    setActiveTab: () => console.error('setActiveTab not yet available in TabContext'),
    removeTab: () => console.error('removeTab not yet available in TabContext'),
});

window.EO_TABS_CONTEXT = globalContext;

export const TabContext = globalContext;