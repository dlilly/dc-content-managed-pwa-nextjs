import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import Header from '../components/Header';
import PromoBanner from '../components/PromoBanner';
import UserActions from '../components/UserActions';
import Navigation from '../components/Navigation';
import SearchBox from '../components/SearchBox';
import Footer from '../components/Footer';
import EditorialBlock from '../components/EditorialBlock';
import HeroBannerBlock from '../components/HeroBannerBlock';
import GalleryBlock from '../components/GalleryBlock';
import Sidebar from '../components/Sidebar';
import { fetchContent } from '../utils/fetchContent';
import axios from 'axios';

import { render } from 'react-dom';
import Carousel from 'react-img-carousel';

interface Props {
    navigation: {
      links: {title: string, href: string}[]
    },
    slot: {
      components: any[]
    }
}

const Index: NextPage<Props> = (props: Props) => {
  let {
      navigation,
      slot
  } = props;

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }
  
  /** Data fixes if not loaded **/
  let defaultNavContent = navigation?.links || [ { title: 'Error: No Navigation Slot with content for delivery key "slots/navigation"', href: '/' }]
  const navigationLinks = defaultNavContent;

  let defaultSlotContent = {
    components: [
      {
          description: 'No Page Slot with content for delivery key "slots/homepage-hero"',
          component: 'EditorialBlock',
          title: 'Error loading content'
      }]
    }
    if(slot && slot.components){
      defaultSlotContent = slot;
    }
    const slotContent = defaultSlotContent;


  return (
    <>
      <Head>
        <title>ALL VALLEY KARATE COMMITTEE</title>
      </Head>
      
      <div>
          <Header actions={<UserActions />}
            search={<SearchBox />}
            onToggleSidebar={handleToggleSidebar}>
          </Header>
        {
            slotContent.components.map(component => {
                let ComponentType = null;

                switch (component.component) {
                    case 'HeroBannerBlock':
                        ComponentType = HeroBannerBlock;
                        break;
                    case 'EditorialBlock':
                        ComponentType = EditorialBlock;
                        break;
                    case 'GalleryBlock':
                        ComponentType = GalleryBlock;
                        break;
                    case 'PromoBannerBlock':
                        ComponentType = PromoBanner;
                        break;
                  }
                
                  if (ComponentType) {
                    return <ComponentType {...component} />;
                  }
                  else if (component.component === 'ProductCarousel') {
                    let images = component['products'].map(prod => <img src={prod.masterData.current.masterVariant.images[0].url} width="200" height="200"/>)
                    return <div style={{textAlign: 'center'}}>
                            <h2>{component['caption']}</h2>
                            <Carousel width="600px" cellPadding={ 5 } slideWidth="200" slideHeight="200">
                              {images}
                            </Carousel>
                          </div>
                  }
            })
        }

        <Footer />
      </div>

      <Sidebar links={navigationLinks} open={sidebarOpen} onToggleOpen={handleToggleSidebar} />
    </>
  );
}

Index.getInitialProps = async (context) => ({
  navigation: await fetchContent('slots/avkc-navigation', context),
  slot: (await axios.get(`http://localhost:3001/api/homepage`, { headers: { Authorization: 'daves-test-project' } })).data
});

export default Index;