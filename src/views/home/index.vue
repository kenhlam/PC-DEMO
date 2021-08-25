<template>
  <div>
    <p v-for="(i,idx) in pageList" :key="idx"><router-link :to="i.roteName">{{i.text}}</router-link></p>
  </div>
</template>
<script>
export default {
  data() {
    return {
     pageList:[
         {
             roteName:"jsplumb",
             text:"jsplumb"
         }
     ]
    };
  },
};
</script>
jsplumb