import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'

import noggles from '../public/noggles-wtf.png'
import { useNounsDataContext } from '../context'
import { authenticateCeramic } from '../utils'
import styles from '../styles/Home.module.css'
import { NounishProfile } from 'nounsdata/model/NounishProfile'

const Home: NextPage = () => {
  const { nounsDataClient } = useNounsDataContext()
  const [profile, setProfile] = useState<NounishProfile | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleLogin = async () => {
    await nounsDataClient.authenticate("bae843b976859f69c37ea6ee66006d54e20f1de456f60e4338a6b47d2648c688")
    // await authenticateCeramic(ceramic, composeClient)
    await getProfile()
  }

  const getProfile = async () => {
    setLoading(true)
    if (nounsDataClient.isAuthenticated()) {
      const profile = await nounsDataClient.getAuthenticatedNounishProfile()
      console.log(profile)
      setProfile(profile)
      setLoading(false);
    }
  }

  const updateProfile = async () => {
    setLoading(true);
    if (nounsDataClient.isAuthenticated() && profile !== undefined) {
      console.log(await nounsDataClient.writeAuthenticatedNounishProfile(profile))
      setLoading(false);
    }
  }

  /**
   * On load check if there is a DID-Session in local storage.
   * If there is a DID-Session we can immediately authenticate the user.
   * For more details on how we do this check the 'authenticateCeramic function in`../utils`.
   */
  useEffect(() => {
    if (localStorage.getItem('did')) {
      handleLogin()
    }
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Nounish Profile</title>
        <meta name="description" content="Your profile within the Nouniverse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Your NounsID Profile</h1>
        <Image
          src={noggles}
          width="250"
          height="100"
          className={styles.logo}
          alt=""
        />
        {profile === undefined && !nounsDataClient.isAuthenticated() ? (
          <button
            onClick={() => {
              handleLogin();
            }}
          >
            Login
          </button>
        ) : (
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label>ETH address</label>
              <input
                type="text"
                defaultValue={profile?.eth_address || ''}
                onChange={(e) => {
                  setProfile({ ...profile, eth_address: e.target.value });
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Timezone (Format: UTC±07:00)</label>
              <input
                type="text"
                defaultValue={profile?.time_zone || ''}
                onChange={(e) => {
                  setProfile({ ...profile, time_zone: e.target.value });
                }}
                maxLength={9}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Twitter handle</label>
              <input
                type="text"
                defaultValue={profile?.twitter_username || ''}
                onChange={(e) => {
                  setProfile({ ...profile, twitter_username: e.target.value });
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Discord username (Format: username#0000)</label>
              <input
                type="text"
                defaultValue={profile?.discord_username || ''}
                onChange={(e) => {
                  setProfile({ ...profile, discord_username: e.target.value });
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Discourse username</label>
              <input
                type="text"
                defaultValue={profile?.discourse_username || ''}
                onChange={(e) => {
                  setProfile({ ...profile, discourse_username: e.target.value });
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Farcaster username</label>
              <input
                type="text"
                defaultValue={profile?.farcaster_username || ''}
                onChange={(e) => {
                  setProfile({ ...profile, farcaster_username: e.target.value });
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Proposal preferences</label>
              <input
                type="text"
                defaultValue={profile?.proposal_category_preference || ''}
                onChange={(e) => {
                  setProfile({ ...profile, proposal_category_preference: e.target.value });
                }}
              />
            </div>
            <div className={styles.buttonContainer}>
              <button
                onClick={() => {
                  updateProfile();
                }}>
                {loading ? 'Loading...' : 'Update Profile'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home
