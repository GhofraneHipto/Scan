import React, { useState, useEffect } from 'react';
import DashboardCard from '../../../components/shared/DashboardCard';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import './selection.css';
import { BASE_URL, api_version } from '../../authentication/config';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Selection() {
  // Begin //
  async function getToken() {
    // Code pour récupérer le token JWT, depuis le localStorage
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    } else {
      // Gérer le cas où aucun token n'est disponible
      throw new Error('No token available');
    }
  }
 // End //
 // Begin //
  const [verticals, setVerticals] = useState([]);
  useEffect(() => {
    const fetchVerticals = async () => {
      try {
        const token = await getToken();
        const responseObject = JSON.parse(token);
        const accessToken = responseObject.access_token;
        const requestOptions = {
          methode: "GET",
          headers: {
            'Hipto-Authorization': accessToken,
          },
          redirect: "follow"
        };
        const response = await axios.get(`${BASE_URL}/${api_version}/verticals`, requestOptions);
        const data = await response.json();
        console.log(data);
        setVerticals(await data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVerticals();
  }, []);
  // End //

  const navigate = useNavigate();
  const [selectedVerticalId, setSelectedVerticalId] = useState('');
  const handleVerticalSelect = (event) => {
    const verticalId = event.target.value;
    setSelectedVerticalId(verticalId);
  };
  const [selectedVertical, setSelectedVertical] = useState('');
  const [sources, setSources] = useState([]);
useEffect(() => {
    const fetchSources = async () => {
      if (selectedVertical) {
        try {
          const token = await getToken();
          const responseObject = JSON.parse(token);
          const accessToken = responseObject.access_token;
          const requestOptions = {
            headers: {
              'Hipto-Authorization': accessToken,
            },
          };
          const response = await fetch(`${BASE_URL}/${api_version}/sources/${selectedVertical}`, requestOptions);
          const data = await response.json();
          setSources(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchSources();
  }, [selectedVertical]);
  return (
    <DashboardCard sx={{ padding: '0px' }} title="Sélection">
      {/* Begin:: separator */}
      <Box pb={4}>
        <Divider sx={{ width: '100%' }} />
      </Box>
      {/* End:: separator */}
      {/* Begin:: Période */}
      <Typography variant="h6" sx={{ fontWeight: '400' }} mb={1}>
        Période
      </Typography>
      <Grid container>
        <Grid item xs={12} sx={{ marginRight: '30px', width: '500px' }} lg={5}>
          <Typography variant="p" sx={{ fontWeight: '400' }} mb={1}>
            De :
          </Typography>
          <input type="date" className="form-control" />
        </Grid>
        <Grid item xs={12} lg={5}>
          <Typography variant="p" sx={{ fontWeight: '400' }} mb={1}>
            à :
          </Typography>
          <input type="date" className="form-control" />
        </Grid>
      </Grid>
      {/* End:: Période */}
      {/* Begin:: select verticales */}
      <FormControl fullWidth>
        <InputLabel id="verticales-label">Verticales</InputLabel>
        <Select
          labelId="verticales-label"
          id="verticales-select"
          label="Verticale"
          value={selectedVerticalId}
          onChange={handleVerticalSelect}
        >
          {verticals.map((get_vertical, index) => (
            <MenuItem key={index} value={get_vertical.vertical_id}>
              {get_vertical.vertical_code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* End:: select verticales */}
      {/* Begin:: select Sources */}
      <Box my={2}>
        <FormControl fullWidth>
          <InputLabel id="sources-label">Sources</InputLabel>
          <Select
            labelId="sources-label"
            id="sources-select"
            label="Source"
          >
            {sources.map((source, index) => (
              <MenuItem key={index} value={source.source_id}>
                {source.source_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* End:: select Sources */}
    </DashboardCard>
  );
}

export default Selection;
