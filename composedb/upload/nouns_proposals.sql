-- nouns_proposals
--
-- Stats about all proposals

WITH token_transfers AS (
        SELECT *
        FROM onchain_token_transfer transfer
        LEFT JOIN onchain_blocknumber_timestamp time 
        ON transfer.blocknumber = time.blocknumber 
        WHERE contract_address = '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03'
    ),
    
    proposal_created AS (
        SELECT onchain_dao_proposalcreated.*,
          time.timestamp
        FROM onchain_dao_proposalcreated
        LEFT JOIN onchain_blocknumber_timestamp time 
        ON onchain_dao_proposalcreated.blocknumber = time.blocknumber 
        WHERE contract_address = '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d'
    ),
    
    vote_cast AS (
        SELECT *
        FROM onchain_dao_votecast
        WHERE contract_address = '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d'
    ),
    
    total_supply AS (
        SELECT 
            day, 
            SUM(tokens_minted) OVER (ORDER BY day ASC) AS total_supply
        FROM (
            SELECT 
                DATE_TRUNC('day', timestamp) AS day, 
                COUNT(*) AS tokens_minted
            FROM token_transfers 
            WHERE args_from = '0x0000000000000000000000000000000000000000'
            GROUP BY 1
            ) a
        ORDER BY 1 ASC
    )
  
    
SELECT 
    proposal_created.args_id proposal_id,
    proposal_created.timestamp created_timestamp,
    proposal_created.args_proposer proposer,
    proposal_created.args_values/1e18 requested_eth,
    proposal_created.args_startblock start_block,
    proposal_created.args_endblock end_block,
    vs.state,
    COALESCE(vs.votes_for + vs.votes_against + vs.votes_abstain, 0) total_votes,
    COALESCE(vs.distinct_voters_for + vs.distinct_voters_against + vs.distinct_votes_abstain, 0) total_distinct_voters,
    proposal_created.args_quorumvotes quorum_required,
    vs.votes_for,
    vs.distinct_voters_for,
    vs.votes_against,
    vs.distinct_voters_against,
    vs.votes_abstain,
    vs.distinct_votes_abstain,
    balances.holders unique_holders,
    ts.total_supply,
    proposal_created.args_description description,
    proposal_created.transactionhash,
    proposal_created.blocknumber
FROM proposal_created
    -- LEFT JOIN ens ens ON proposal_created.proposer = ens.address
    LEFT JOIN total_supply ts ON ts.day = date_trunc('day', proposal_created.timestamp)
    LEFT JOIN nouns_votes_summary vs on vs.id = proposal_created.args_id
    LEFT JOIN 
        (SELECT 
            day, 
            COUNT(wallet) FILTER (WHERE holding > 0) holders
        FROM nouns_running_wallet_balances
        GROUP BY day) balances
    ON balances.day = date_trunc('day', proposal_created.timestamp)
ORDER BY blocknumber DESC