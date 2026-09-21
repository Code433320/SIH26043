import { supabase } from '../config/supabaseClient.js';
import { ApiError } from '../utils/apiError.js';

const countByStatus = (rows) =>
  rows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});

export const getCitizenStats = async (citizenId) => {
  const { data, error } = await supabase.from('problems').select('status').eq('citizen_id', citizenId);
  if (error) throw new ApiError(500, error.message);
  return { totalReported: data.length, byStatus: countByStatus(data) };
};

export const getUniversityStats = async (universityId) => {
  const { data: problems, error: pErr } = await supabase
    .from('problems')
    .select('status')
    .eq('university_id', universityId);
  if (pErr) throw new ApiError(500, pErr.message);

  const { data: solutions, error: sErr } = await supabase
    .from('solutions')
    .select('status')
    .eq('university_id', universityId);
  if (sErr) throw new ApiError(500, sErr.message);

  return {
    matchedProblems: problems.length,
    problemsByStatus: countByStatus(problems),
    activeTeams: solutions.filter((s) => s.status !== 'resolved').length,
    solutionsSubmitted: solutions.length,
  };
};

export const getIndustryStats = async (industryId) => {
  const { data, error } = await supabase
    .from('industry_engagements')
    .select('type')
    .eq('industry_id', industryId);
  if (error) throw new ApiError(500, error.message);

  return {
    totalEngagements: data.length,
    funding: data.filter((e) => e.type === 'funding').length,
    mentorship: data.filter((e) => e.type === 'mentorship').length,
  };
};

export const getGovernmentStats = async () => {
  const { data, error } = await supabase.from('problems').select('status');
  if (error) throw new ApiError(500, error.message);
  return { totalProblems: data.length, byStatus: countByStatus(data) };
};