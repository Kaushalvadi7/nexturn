import React, { useEffect, useMemo, useState } from 'react';
import { getContactInfo } from '../../lib/api';
import {
  buildExternalUrl,
  buildMailto,
  buildMapDirections,
  buildMapEmbed,
  buildMaps,
  buildTel,
  buildWhatsApp,
  ContactInfoContext,
} from './contactInfo';

const ContactInfoProvider = ({ children }) => {
  const [info, setInfo] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    companyDescription: '',
    companyProfile: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    x: '',
    youtube: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getContactInfo();
      setInfo({
        email: String(data?.email || ''),
        phone: String(data?.phone || ''),
        whatsapp: String(data?.whatsapp || ''),
        location: String(data?.location || ''),
        companyDescription: String(data?.companyDescription || ''),
        companyProfile: String(data?.companyProfile || ''),
        facebook: String(data?.facebook || ''),
        instagram: String(data?.instagram || ''),
        linkedin: String(data?.linkedin || ''),
        x: String(data?.x || ''),
        youtube: String(data?.youtube || ''),
      });
    } catch (e) {
      setError(e?.message || 'Failed to load contact info.');
      setInfo({
        email: '',
        phone: '',
        whatsapp: '',
        location: '',
        companyDescription: '',
        companyProfile: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        x: '',
        youtube: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  const hrefs = useMemo(() => ({
    mailto: buildMailto(info.email),
    tel: buildTel(info.phone),
    whatsapp: buildWhatsApp(info.whatsapp),
    maps: buildMaps(info.location),
    mapEmbed: buildMapEmbed(info.location),
    mapDirections: buildMapDirections(info.location),
    facebook: buildExternalUrl(info.facebook),
    instagram: buildExternalUrl(info.instagram),
    linkedin: buildExternalUrl(info.linkedin),
    x: buildExternalUrl(info.x),
    youtube: buildExternalUrl(info.youtube),
    companyProfile: buildExternalUrl(info.companyProfile),
  }), [info.email, info.phone, info.whatsapp, info.location, info.facebook, info.instagram, info.linkedin, info.x, info.youtube, info.companyProfile]);

  const value = useMemo(() => ({
    info,
    hrefs,
    isLoading,
    error,
    refresh,
  }), [info, hrefs, isLoading, error]);

  return (
    <ContactInfoContext.Provider value={value}>
      {children}
    </ContactInfoContext.Provider>
  );
};

export default ContactInfoProvider;
