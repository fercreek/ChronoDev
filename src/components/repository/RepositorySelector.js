import React from 'react';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  OutlinedInput
} from '@mui/material';
import moment from 'moment';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function RepositorySelector({ repositories, selectedRepos, onSelectionChange }) {
  const handleRepoSelection = (event) => {
    const value = event.target.value;
    onSelectionChange(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Repository Selection
      </Typography>

      {repositories.length > 0 && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Repositories</InputLabel>
          <Select
            multiple
            value={selectedRepos}
            onChange={handleRepoSelection}
            input={<OutlinedInput label="Select Repositories" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value.split('/').pop()} size="small" />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {repositories.map((repo) => {
              const lastActivity = repo.pushedAt || repo.updatedAt;
              const activityLabel = repo.pushedAt ? 'Last push' : 'Updated';
              
              return (
                <MenuItem key={repo.fullName} value={repo.fullName}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight="medium">
                        {repo.name}
                      </Typography>
                      <Typography variant="caption" color="primary">
                        {moment(lastActivity).fromNow()}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                      {repo.description || 'No description'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="textSecondary">
                        {repo.language || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {activityLabel}: {moment(lastActivity).format('MMM D, YYYY')}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}

      {selectedRepos.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Selected Repositories ({selectedRepos.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedRepos.map((repo) => (
              <Chip
                key={repo}
                label={repo.split('/').pop()}
                onDelete={() => {
                  const newSelection = selectedRepos.filter(r => r !== repo);
                  onSelectionChange(newSelection);
                }}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}

export default RepositorySelector;
