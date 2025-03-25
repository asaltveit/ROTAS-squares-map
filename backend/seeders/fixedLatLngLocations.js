'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('locations', [
      {
        place: 'Acquincum, Pannonia',
        latitude: 47.5591305,
        fixed_latitude: 47.5591305,
        longitude: 19.04988911,
        fixed_longitude: 19.04988911,
        type: 'inscription',
        created_year_start: 107,
        created_year_end: 107,
        discovered_year: 1951,
        text: 'Rotas opera tenet arepo sator.',
        location: 'Baked into roof tile of governor\'s mansion',
        shelfmark: null,
        script: 'Latin',
        first_word: 'Rotas',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        place: 'Manchester, England',
        latitude: 53.47964873,
        fixed_latitude: 53.47964873,
        longitude: -2.248745246,
        fixed_longitude: -2.248745246,
        type: 'inscription',
        created_year_start: 150,
        created_year_end: 200,
        discovered_year: 1978,
        text: 'Rotas opera tenet arepo sator.',
        location: 'amphora fragment in Deansgate rubbish pit',
        shelfmark: 'CIL 4.8123',
        script: 'Latin',
        first_word: 'Rotas',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        place: 'Pompeii',
        latitude: 40.75196418,
        fixed_latitude: 40.75196418,
        longitude: 14.49337649,
        fixed_longitude: 14.49337649,
        type: 'dipinto',
        created_year_start: 69,
        created_year_end: 79,
        discovered_year: 1753,
        text: 'Rotas opera tenet arepo sator.',
        location: 'Wall of bath at Praedia of Julia Felix, Reg. II, Ins. 4 between nos. 6 and 7.',
        shelfmark: 'CIL IV 1136-1154',
        script: 'Latin',
        first_word: 'Rotas',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        place: 'Conimbriga, Portugal',
        latitude: 40.09870212,
        fixed_latitude: 40.09870212,
        longitude: -8.490821361,
        fixed_longitude: -8.490821361,
        type: 'inscription',
        created_year_start: 50,
        created_year_end: 125,
        discovered_year: 1968,
        text: 'Rotas opera tenet arepo sator.',
        location: 'on a brick found out of strata',
        script: 'Latin',
        first_word: 'Rotas',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        place: 'Egyptian papyrus amulet',
        latitude: 29.30954785,
        fixed_latitude: 29.30954785,
        longitude: 30.84245792,
        fixed_longitude: 30.84245792,
        type: 'amulet',
        created_year_start: 575,
        created_year_end: 625,
        text: 'ⲤⲀⲦⲰⲢ ⲀⲢⲈⲦⲰ ⲦhⲚhⲦ ⲰⲦhⲢⲀ ⲢⲰⲦⲀⲤ',
        location: 'Folded amulet now at Yale Beinecke',
        shelfmark: 'Yale MS P.CtYBR inv. 1792',
        script: 'Coptic',
        first_word: 'ⲤⲀⲦⲰⲢ',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('locations', null, {});
  }
};