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

  console.log(JSON.stringify(slot))

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
          {/* <PromoBanner>BREAKING: Cobra Kai allowed to compete</PromoBanner>
 */}
          <Header actions={<UserActions />}
            search={<SearchBox />}
            // navigation={(
            //   <Navigation links={navigationLinks}>
            //   </Navigation>
            // )}
            onToggleSidebar={handleToggleSidebar}>
          </Header>

              {/* components[0].product carousel[0].masterData.current.masterVariant.images[0].url */}

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

Index.getInitialProps = async (context) => {
  const navigation = await fetchContent('slots/avkc-navigation', context);

  console.log(JSON.stringify(navigation))

  const slot = (await axios.get(`https://dlilly.ngrok.io/api/homepage`, { headers: { Authorization: 'daves-test-project' } })).data
  // const slot = await fetchContent('dave-page-slot', context);
  // const productCarousel = fetchContent('product-carousel', context);
  // const products = await axios.get(`https://dlilly.ngrok.io/api/products`, { headers: { Authorization: 'daves-test-project' } })

  return {
    navigation,
    slot
  };
};

export default Index;