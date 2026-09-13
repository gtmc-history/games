# 독도연구소: 1905 파일 — 정본 사료 locator

BUILD에서 사료 이미지·전사·링크를 붙일 때 이 표를 우선 확인한다. `학생용 현대어 재구성`과 `당대 원문 전사`를 같은 것으로 취급하지 않는다.

| 연도 | 자료 | 정본 locator | 현재 BUILD 사용 |
|---|---|---|---|
| 1877 | 日本海内竹島外一島地籍ニ編纂方伺 / 磯竹島略圖 | National Archives of Japan Digital Archive, `公02032100-01600`, catalog `https://www.digital.archives.go.jp/item/en/3018187`, item metadata `https://www.digital.archives.go.jp/item/3018187.json`, content viewer pattern `https://www.digital.archives.go.jp/img/3018187#[page]` | 핵심 원문 전사 + 정본 링크. 공식 JSON/IIIF 경로는 식별했으나 지도 page/image identifier는 아직 미확정 |
| 1900 | 勅令第四十一號 | 국사편찬위원회 한국사DB `gbdh_1900_10_27_a01716_00040`, https://db.history.go.kr/id/gbdh_1900_10_27_a01716_00040 | 제1·2조 원문 전사 + 학생용 현대어 |
| 1904 | 軍艦新高行動日誌（5） | JACAR Ref. `C09050457300`, 방위성 방위연구소 | 메타데이터·학생용 설명. 원문 이미지는 허가 전 미포함 |
| 1904 | 軍艦對馬戰時日誌（5） | JACAR Ref. `C09050402800`, 방위성 방위연구소 | 1904-11-20 전신소 설치 적합성 조사 사실·메타데이터. 정확한 이미지 프레임 미확정 |
| 1905 | 일본 내각 결정 | 내각관방 영토·주권대책기획조정실 자료 페이지, https://www.cas.go.jp/jp/ryodo/kenkyu/takeshima/shiryo_vol001-01.html ; 원문 소장: 일본 국립공문서관 「公文類聚・第二十九編・明治三十八年・第一巻」 | 당대 결정문의 핵심구절 전사 + 학생용 현대어. 현재 일본 정부의 `주권 재확인` 해설과 분리 |
| 1905 | 島根縣告示第四十號 | 내각관방 영토·주권대책기획조정실 자료 페이지, https://www.cas.go.jp/jp/ryodo/kenkyu/takeshima/shiryo_vol001-05.html ; 원문 소장: 島根県公文書センター | 고시 핵심구절 전사 + 선택 조사 설명. 원문 이미지 미포함 |
| 1906 | 報告書 號外 | 국사편찬위원회 한국사DB `mk_002_0010_0560`, 『各觀察道(去來)案』, https://db.history.go.kr/id/mk_002_0010_0560 | `本郡所屬獨島` 및 일본 관리 일행 통보 부분 원문 전사 + 학생용 현대어 |
| 1906 | 指令 第三號 | 같은 DB 기사 `mk_002_0010_0560` | `獨島領地之說은 全屬無根…` 원문 전사 + 학생용 현대어 |

## 1877 공식 메타데이터 경로

일본 국립공문서관 최신 이용안내는 item metadata를 `item/[ID].json`으로 제공한다고 명시한다. item/file RDF 구조에서 다음 필드가 이미지 자산 식별에 직접 관련된다.

- `owl:sameAs` — content URL
- `rdfs:seeAlso` — IIIF manifest URL
- `foaf:thumbnail` — thumbnail image URL
- `dct:license` — content license/reuse information

IIIF manifest는 `https://www.digital.archives.go.jp/api/iiif/[Image identifier]/manifest.json` 형식이다. `[Image identifier]`는 catalog item ID와 같다고 가정하지 않고, item JSON의 `rdfs:seeAlso` 값으로 확정한다.

따라서 S2 asset 확보 순서는 `item/3018187.json → rdfs:seeAlso → manifest canvas/page 확인 → 공식 image service → local crop`으로 고정한다. 구현 세부 계약은 `S2_MAP_ASSET_CONTRACT.md`를 따른다.

## 현재 자산 blocker

- **1877 기죽도약도**: 재사용 권리는 확인했다. 공식 item 페이지에 `Image / Browse`가 있고, 최신 국립공문서관 문서에서 item JSON과 IIIF manifest 노출 구조까지 확인했다. 다만 현재 자동 접근 환경은 `item/3018187.json`을 직접 가져오지 못하여 **실제 `rdfs:seeAlso` 값과 지도 page를 아직 읽지 못했다.** 제3자 복제본으로 canonical asset을 대체하지 않는다.
- **1904 쓰시마**: `C09050402800`까지 정본 식별됨. 1904-11-20 기록의 정확한 스캔 이미지 번호는 아직 추정하지 않는다.
- **NIKH 이미지**: 한국사DB 저작권 정책상 DB가 제공하는 스캔·현대 가공물의 공개 웹게임 재사용을 일괄 허용한다고 볼 수 없다. 역사적 원문 전사와 링크를 우선 사용한다.

## 출처 표기 원칙

학생 화면에는 소장기관/작성자/연도/문서종류를 자연어로 표시한다. 내부 A/B 등급, source ID, 검수용 locator는 노출하지 않는다. 실제 이미지가 들어가면 소장기관·자료명·reference/article ID와 가공 여부(크롭·확대 등)를 함께 밝힌다.
