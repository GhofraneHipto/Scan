import React, { useState, useEffect } from 'react';
import DashboardCard from '../../../components/shared/DashboardCard';
import { Typography, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { BASE_URL, api_version } from '../../authentication/config';

function Statistiques({ CanalCount, SourceCount,selectedVerticalId,
  selectedDateFrom,
  selectedDateTo, }) {
  async function getToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      throw new Error('No token available');
    }
  }

  const [LogoSocialNetworks, setLogoSocialNetworks] = useState({});
  const [LogoChannels, setLogoChannels] = useState({});

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const token = await getToken();
        const responseObject = JSON.parse(token);
        const accessToken = responseObject.access_token;
        const formdata = new FormData();
        formdata.append('Hipto-Authorization', accessToken);
        const requestOptions = {
          method: 'POST',
          body: formdata,
        };
        // Fetching social networks logos
        const socialNetworksResponse = await fetch(`${BASE_URL}/${api_version}/social_networks`, requestOptions);
        const socialNetworksData = await socialNetworksResponse.json();
        const socialNetworksLogos = {};
        socialNetworksData.forEach(item => {
          const sourceName = item.sn_name.toLowerCase();
          socialNetworksLogos[sourceName] = item.sn_logo;
        });
        setLogoSocialNetworks(socialNetworksLogos);

        // Fetching channels logos
        const channelsResponse = await fetch(`${BASE_URL}/${api_version}/channels`, requestOptions);
        const channelsData = await channelsResponse.json();
        const channelsLogos = {};
        channelsData.forEach(item => {
          const channelName = item.channel_name.toLowerCase();
          channelsLogos[channelName] = item.channel_logo;
        });
        setLogoChannels(channelsLogos);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogos();
  }, []);
  const [leadsTestByChannel, setLeadsTestByChannel] = useState({});

  useEffect(() => {
    if (selectedVerticalId && selectedDateFrom && selectedDateTo) {
    const fetchLeadsTestByChannel = async () => {
      try {
        const token = await getToken();
        const responseObject = JSON.parse(token);
        const accessToken = responseObject.access_token;
        const formdata = new FormData();
        formdata.append('Hipto-Authorization', accessToken);
        const requestOptions = {
          method: 'POST',
          body: formdata,
        };
        const response = await fetch(`${BASE_URL}/${api_version}/report/channels?from=${selectedDateFrom}&to=${selectedDateTo}&vertical_id=${selectedVerticalId}`, requestOptions);
        const data = await response.json();
        const channelsLeads = {};
data.forEach(item => {
    const channelName = item.channel_name.toLowerCase();
    channelsLeads[channelName] = item.leads_test;
});
        setLeadsTestByChannel(channelsLeads);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeadsTestByChannel();
  }
}, [selectedVerticalId, selectedDateFrom, selectedDateTo]);
console.log(leadsTestByChannel);
  return (
    <DashboardCard title="Statistiques">
      <Box pb={4}>
        <Divider sx={{ width: '100%' }} />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <DashboardCard backgroundColor="#080655" color="white" title="Canal">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Grid container>
                {Object.keys(CanalCount).map((canal, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={12} lg={6} pb={2} sx={{ display: 'flex', alignItems: 'center' }}>
                      <img src={LogoChannels[canal.toLowerCase()]} alt='' width={25} />
                      <Typography pl={1} variant="h9">{canal}</Typography>
                    </Grid>
                    <Grid item xs={12} lg={6} sx={{ textAlign: 'end' }} > 
                      <Typography variant="h9">{CanalCount[canal]}</Typography>
                      <Typography key={index} variant="h9">({leadsTestByChannel[canal] !== undefined ? leadsTestByChannel[canal] : 0})</Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} lg={6}>
          <DashboardCard backgroundColor="#3188DC" color="white" title="Source d’acquisition">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Grid container>
                {Object.keys(SourceCount).map((source, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={12} lg={6} pb={2} sx={{ display: 'flex', alignItems: 'center' }}>
                      <img src={LogoSocialNetworks[source.toLowerCase()]} alt='' width={25} />
                      <Typography pl={1} variant="h9">{source}</Typography>
                    </Grid>
                    <Grid item xs={12} lg={6} sx={{ textAlign: 'end' }}>
                      <Typography variant="h9">{SourceCount[source]}</Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </DashboardCard>
  );
}

export default Statistiques;
